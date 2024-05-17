import { unlink } from 'node:fs/promises';
import { Prisma } from '@prisma/client';
import { uploadFormDataSchema, uploadListInputSchema } from '../schemas';
import {
  protectedAdminProcedure,
  protectedUserProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError, write } from '../utils';

export const publicAppUpload = router({});

export const protectedAppUpload = router({
  list: protectedUserProcedure
    .input(uploadListInputSchema)
    .query(
      async ({
        ctx: { prisma, session },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.FileWhereInput = {
            ...(query
              ? {
                  OR: [
                    {
                      name: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                    {
                      path: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                    {
                      mimeType: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {}),
            ...(rest.mimeType ? { mimeType: { equals: rest.mimeType } } : {}),
            Users: {
              some: {
                id: session.user.id,
              },
            },
          };

          const [items, total] = await prisma.$transaction([
            prisma.file.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              // select: defaultSelect,
            }),
            prisma.file.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  upload: protectedUserProcedure
    .input(uploadFormDataSchema)
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      const data = await write(input.file);
      await prisma.$transaction(async (tx) => {
        const existedFile = await tx.file.findFirst({
          where: {
            md5: data.md5,
          },
          include: {
            Users: {
              select: {
                id: true,
              },
            },
          },
        });

        if (existedFile) {
          if (
            existedFile.Users.findIndex((user) => user.id === session.user.id) >
            -1
          )
            return;
          await unlink(data.path);
          await tx.file.update({
            where: {
              id: existedFile.id,
            },
            data: {
              Users: {
                connect: {
                  id: session.user.id,
                },
              },
            },
          });
          return;
        }

        await tx.file.create({
          data,
        });
      });
      return true;
    }),
});

export const publicDashboardUpload = router({});

export const protectedDashboardUpload = router({
  list: protectedAdminProcedure
    .input(uploadListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.FileWhereInput = {
            ...(query
              ? {
                  OR: [
                    {
                      name: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                    {
                      path: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                    {
                      mimeType: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {}),
            ...(rest.mimeType ? { mimeType: { equals: rest.mimeType } } : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.file.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              // select: defaultSelect,
            }),
            prisma.file.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  upload: protectedAdminProcedure
    .input(uploadFormDataSchema)
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      const data = await write(input.file);

      await prisma.$transaction(async (tx) => {
        const existedFile = await tx.file.findFirst({
          where: {
            md5: data.md5,
          },
          include: {
            Users: {
              select: {
                id: true,
              },
            },
          },
        });

        if (existedFile) {
          if (
            existedFile.Users.findIndex((user) => user.id === session.user.id) >
            -1
          )
            return;
          await unlink(data.path);
          await tx.file.update({
            where: {
              id: existedFile.id,
            },
            data: {
              Users: {
                connect: {
                  id: session.user.id,
                },
              },
            },
          });
          return;
        }

        await tx.file.create({
          data,
        });
      });
      return true;
    }),
});
