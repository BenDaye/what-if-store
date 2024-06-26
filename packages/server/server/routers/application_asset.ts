import { readFile } from 'fs/promises';
import path from 'path';
import { ApplicationAssetType, Prisma } from '@what-if-store/prisma/client';
import { access, formatListRequest, formatListResponse, handleServerError } from '@what-if-store/utils';
import { observable } from '@trpc/server/observable';
import { applicationAssetEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import {
  applicationAssetCreateInputSchema,
  applicationAssetListInputSchema,
  applicationAssetUpdateInputSchema,
  applicationAssetUpsertFileContentInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import { protectedAdminProcedure, protectedProviderProcedure, publicProcedure, router } from '../trpc';

const defaultSelect = Prisma.validator<Prisma.ApplicationAssetSelect>()({
  id: true,
  applicationId: true,
  type: true,
  url: true,
  name: true,
  description: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationAssetSelect>()({
    content: true,
    isPrimary: true,
    isLocal: true,
    Application: {
      select: {
        id: true,
        name: true,
        providerId: true,
      },
    },
  }),
};

export const publicAppApplicationAsset = router({
  subscribe: publicProcedure.subscription(() => {
    return observable<IdSchema>((emit) => {
      const onCreate = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };
      const onUpdate = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };
      const onRemove = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };

      applicationAssetEmitter.on('create', onCreate);
      applicationAssetEmitter.on('update', onUpdate);
      applicationAssetEmitter.on('remove', onRemove);
      return () => {
        applicationAssetEmitter.off('create', onCreate);
        applicationAssetEmitter.off('update', onUpdate);
        applicationAssetEmitter.off('remove', onRemove);
      };
    });
  }),
  getById: publicProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationAsset.findUniqueOrThrow({
        where: {
          id,
        },
        select: fullSelect,
      });
    } catch (err) {
      throw handleServerError(err);
    }
  }),
});

export const protectedAppApplicationAsset = router({
  list: protectedProviderProcedure
    .input(applicationAssetListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
      try {
        const where: Prisma.ApplicationAssetWhereInput = {
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
                    description: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
          ...(rest.type?.length ? { type: { in: rest.type } } : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationAsset.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationAsset.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  create: protectedProviderProcedure
    .input(applicationAssetCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const result = await prisma.applicationAsset.create({
          data: input,
          select: defaultSelect,
        });
        applicationAssetEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});

export const publicDashboardApplicationAsset = router({});

export const protectedDashboardApplicationAsset = router({
  subscribe: protectedAdminProcedure.subscription(() => {
    return observable<IdSchema>((emit) => {
      const onCreate = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };
      const onUpdate = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };
      const onRemove = (id: IdSchema) => {
        try {
          emit.next(id);
        } catch (error) {
          emit.error(error);
        }
      };

      applicationAssetEmitter.on('create', onCreate);
      applicationAssetEmitter.on('update', onUpdate);
      applicationAssetEmitter.on('remove', onRemove);
      return () => {
        applicationAssetEmitter.off('create', onCreate);
        applicationAssetEmitter.off('update', onUpdate);
        applicationAssetEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationAssetListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
      try {
        const where: Prisma.ApplicationAssetWhereInput = {
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
                    description: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
          ...(rest.type?.length ? { type: { in: rest.type } } : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationAsset.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationAsset.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationAsset.findUniqueOrThrow({
        where: {
          id,
        },
        select: fullSelect,
      });
    } catch (err) {
      throw handleServerError(err);
    }
  }),
  updateById: protectedAdminProcedure
    .input(applicationAssetUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.applicationAsset.update({
          where: {
            id,
          },
          data: input,
        });
        applicationAssetEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  upsertFileContent: protectedAdminProcedure
    .input(applicationAssetUpsertFileContentInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { applicationId, name, content } }) => {
      try {
        await prisma.applicationAsset.upsert({
          where: {
            applicationId_type_name: {
              applicationId,
              name,
              type: ApplicationAssetType.File,
            },
          },
          create: {
            applicationId,
            type: ApplicationAssetType.File,
            name,
            url: '',
            content,
          },
          update: {
            content,
          },
        });
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  removeById: protectedAdminProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: id }) => {
      try {
        await prisma.applicationAsset.delete({
          where: {
            id,
          },
        });
        applicationAssetEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getFileById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      const { url } = await prisma.applicationAsset.findUniqueOrThrow({
        where: {
          id,
          type: ApplicationAssetType.File,
        },
        select: {
          url: true,
        },
      });
      const filePath = path.join(process.cwd(), url);
      await access(filePath, true);
      const file = await readFile(filePath, {
        encoding: 'utf8',
      });
      return file;
    } catch (err) {
      throw handleServerError(err);
    }
  }),
  updateFileById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      const { url } = await prisma.applicationAsset.findUniqueOrThrow({
        where: {
          id,
          type: ApplicationAssetType.File,
        },
        select: {
          url: true,
        },
      });
      const filePath = path.join(process.cwd(), url);
      await access(filePath, true);
      const file = await readFile(filePath, {
        encoding: 'utf8',
      });
      return file;
    } catch (err) {
      throw handleServerError(err);
    }
  }),
});
