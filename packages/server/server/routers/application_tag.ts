import { Prisma } from '@what-if-store/prisma/client';
import { formatListRequest, formatListResponse, handleServerError } from '@what-if-store/utils';
import { observable } from '@trpc/server/observable';
import { applicationTagEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import {
  applicationTagCreateInputSchema,
  applicationTagListInputSchema,
  applicationTagUpdateInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import { protectedAdminProcedure, protectedProviderProcedure, publicProcedure, router } from '../trpc';

const defaultSelect = Prisma.validator<Prisma.ApplicationTagSelect>()({
  id: true,
  name: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationTagSelect>()({
    Applications: {
      select: {
        id: true,
        name: true,
        providerId: true,
      },
    },
  }),
};

export const publicAppApplicationTag = router({
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

      applicationTagEmitter.on('create', onCreate);
      applicationTagEmitter.on('update', onUpdate);
      applicationTagEmitter.on('remove', onRemove);
      return () => {
        applicationTagEmitter.off('create', onCreate);
        applicationTagEmitter.off('update', onUpdate);
        applicationTagEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(applicationTagListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
      try {
        const where: Prisma.ApplicationTagWhereInput = {
          ...(query
            ? {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationTag.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationTag.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: publicProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationTag.findUniqueOrThrow({
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

export const protectedAppApplicationTag = router({
  create: protectedProviderProcedure
    .input(applicationTagCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const result = await prisma.applicationTag.create({
          data: input,
          select: defaultSelect,
        });
        applicationTagEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});

export const publicDashboardApplicationTag = router({});

export const protectedDashboardApplicationTag = router({
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

      applicationTagEmitter.on('create', onCreate);
      applicationTagEmitter.on('update', onUpdate);
      applicationTagEmitter.on('remove', onRemove);
      return () => {
        applicationTagEmitter.off('create', onCreate);
        applicationTagEmitter.off('update', onUpdate);
        applicationTagEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationTagListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
      try {
        const where: Prisma.ApplicationTagWhereInput = {
          ...(query
            ? {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationTag.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationTag.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationTag.findUniqueOrThrow({
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
    .input(applicationTagUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.applicationTag.update({
          where: {
            id,
          },
          data: input,
        });
        applicationTagEmitter.emit('update', id);
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
        await prisma.applicationTag.delete({
          where: {
            id,
          },
        });
        applicationTagEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});
