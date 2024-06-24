import { Prisma } from '@what-if-store/prisma/client';
import { formatListRequest, formatListResponse, handleServerError } from '@what-if-store/utils';
import { observable } from '@trpc/server/observable';
import { applicationGroupEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import {
  applicationGroupCreateInputSchema,
  applicationGroupListInputSchema,
  applicationGroupUpdateInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import { protectedAdminProcedure, publicProcedure, router } from '../trpc';

const defaultSelect = Prisma.validator<Prisma.ApplicationGroupSelect>()({
  id: true,
  name: true,
  description: true,
  type: true,
  priority: true,
  _count: {
    select: {
      Applications: true,
    },
  },
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
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
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
            ...formatListRequest(limit, skip, cursor),
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
        throw handleServerError(err);
      }
    }),
  getById: publicProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationGroup.findUniqueOrThrow({
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
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
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
            ...formatListRequest(limit, skip, cursor),
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
        throw handleServerError(err);
      }
    }),
  create: protectedAdminProcedure
    .input(applicationGroupCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { applications, ...data } }) => {
      try {
        const result = await prisma.applicationGroup.create({
          data: {
            ...data,
            Applications: {
              connect: applications,
            },
          },
          select: defaultSelect,
        });
        applicationGroupEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationGroup.findUniqueOrThrow({
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
    .input(applicationGroupUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, applications, ...data } }) => {
      try {
        await prisma.applicationGroup.update({
          where: {
            id,
          },
          data: {
            ...data,
            Applications: {
              set: applications,
            },
          },
        });
        applicationGroupEmitter.emit('update', id);
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
        // TODO: Should it be checked if the application group type is deletable?
        await prisma.applicationGroup.delete({
          where: {
            id,
          },
        });
        applicationGroupEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});
