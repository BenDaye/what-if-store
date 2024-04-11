import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { format } from 'date-fns';
import { PathLike, createWriteStream } from 'node:fs';
import {
  constants,
  access as fsAccess,
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { ulid } from 'ulidx';

export const access = async (
  path: PathLike,
  createIfNotExist = false,
  isDirectory = false,
): Promise<void> => {
  try {
    await fsAccess(path, constants.F_OK);
  } catch (error) {
    if (!createIfNotExist) throw error;
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') return;
    if (isDirectory) {
      await mkdir(path, { recursive: true });
      return;
    }
    await writeFile(path, '', { encoding: 'utf8' });
  }
};

export const calculateFileMD5 = async (path: string): Promise<string> => {
  const fileContent = await readFile(path);
  const fileHash = createHash('md5');
  fileHash.update(fileContent);
  return fileHash.digest('hex');
};

export const write = async (
  file: File,
): Promise<Prisma.FileCreateWithoutUsersInput> => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const nonce = format(Date.now(), 'yyyy/MM/dd');
  const fileDir = path.resolve(uploadDir, nonce);
  await access(fileDir, true, true);

  const newFileName = `${ulid()}${path.extname(file.name)}`;
  const filePath = path.resolve(fileDir, newFileName);
  const fd = createWriteStream(filePath);
  const fileStream = Readable.fromWeb(
    // @ts-expect-error - unsure why this is not working
    file.stream(),
  );

  for await (const chunk of fileStream) {
    fd.write(chunk);
  }
  fd.end();

  const fileMD5 = await calculateFileMD5(filePath);

  return {
    name: newFileName,
    path: path.join('/uploads', nonce, newFileName),
    md5: fileMD5,
    size: file.size,
    mimeType: file.type,
  };
};
