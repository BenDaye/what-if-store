import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationGroupEmitter } from '../modules';
import {
  IdSchema,
  applicationGroupCreateInputSchema,
  applicationGroupListInputSchema,
  applicationGroupUpdateInputSchema,
  idSchema,
} from '../schemas';
import { protectedAdminProcedure, publicProcedure, router } from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.ApplicationGroupSelect>()({
  id: true,
  name: true,
  description: true,
  type: true,
  priority: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationGroupSelect>()({
    Applications: {
      select: {
        id: true,
        name: true,
        providerId: true,
      },
    },
  }),
};

export const publicAppApplicationGroup = router({
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

      applicationGroupEmitter.on('create', onCreate);
      applicationGroupEmitter.on('update', onUpdate);
      applicationGroupEmitter.on('remove', onRemove);
      return () => {
        applicationGroupEmitter.off('create', onCreate);
        applicationGroupEmitter.off('update', onUpdate);
        applicationGroupEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(applicationGroupListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ApplicationGroupWhereInput = {
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
            ...(rest.type
              ? {
                  type: {
                    equals: rest.type,
                  },
                }
              : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.applicationGroup.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  priority: 'asc',
                },
                { name: 'asc' },
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.applicationGroup.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.applicationGroup.findUniqueOrThrow({
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

export const protectedAppApplicationGroup = router({});

export const publicDashboardApplicationGroup = router({});

export const protectedDashboardApplicationGroup = router({
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

      applicationGroupEmitter.on('create', onCreate);
      applicationGroupEmitter.on('update', onUpdate);
      applicationGroupEmitter.on('remove', onRemove);
      return () => {
        applicationGroupEmitter.off('create', onCreate);
        applicationGroupEmitter.off('update', onUpdate);
        applicationGroupEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationGroupListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ApplicationGroupWhereInput = {
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
            ...(rest.type
              ? {
                  type: {
                    equals: rest.type,
                  },
                }
              : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.applicationGroup.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  priority: 'asc',
                },
                { name: 'asc' },
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.applicationGroup.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  create: protectedAdminProcedure
    .input(applicationGroupCreateInputSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const result = await prisma.applicationGroup.create({
          data: input,
          select: defaultSelect,
        });
        applicationGroupEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  getById: protectedAdminProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.applicationGroup.findUniqueOrThrow({
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
    .input(applicationGroupUpdateInputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.applicationGroup.update({
          where: {
            id,
          },
          data: input,
        });
        applicationGroupEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  removeById: protectedAdminProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { prisma }, input: id }) => {
      try {
        // FIXME: is it necessary to check the group type?
        await prisma.applicationGroup.delete({
          where: {
            id,
          },
        });
        applicationGroupEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
