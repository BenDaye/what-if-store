import { PathLike } from 'fs';
import { constants, access as fsAccess, writeFile } from 'fs/promises';

export const access = async (
  path: PathLike,
  createIfNotExist = false,
): Promise<void> => {
  try {
    await fsAccess(path, constants.F_OK);
  } catch (error) {
    if (!createIfNotExist) throw error;
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      await writeFile(path, '', { encoding: 'utf8' });
  }
};
