import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationTagEmitter } from '../modules';
import {
  IdSchema,
  applicationTagCreateInputSchema,
  applicationTagListInputSchema,
  applicationTagUpdateInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import {
  protectedAdminProcedure,
  protectedProviderProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

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
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.applicationTag.findUniqueOrThrow({
          where: {
            id,
          },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const protectedAppApplicationTag = router({
  list: protectedProviderProcedure
    .input(applicationTagListInputSchema)
    .query(
      async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
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
              ...formatListArgs(limit, skip, cursor),
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
          throw onError(err);
        }
      },
    ),
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
        throw onError(err);
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
    .query(
      async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
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
              ...formatListArgs(limit, skip, cursor),
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
          throw onError(err);
        }
      },
    ),
  getById: protectedAdminProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.applicationTag.findUniqueOrThrow({
          where: {
            id,
          },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
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
        throw onError(err);
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
        throw onError(err);
      }
    }),
});
