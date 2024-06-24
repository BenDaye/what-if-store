import { ApplicationStatus, Prisma } from '@what-if-store/prisma/client';
import { formatListRequest, formatListResponse, handleServerError } from '@what-if-store/utils';
import { observable } from '@trpc/server/observable';
import { applicationVersionEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import {
  applicationVersionCreateInputSchema,
  applicationVersionListInputSchema,
  applicationVersionUpdateInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import { protectedAdminProcedure, protectedProviderProcedure, publicProcedure, router } from '../trpc';

const defaultSelect = Prisma.validator<Prisma.ApplicationVersionSelect>()({
  id: true,
  version: true,
  latest: true,
  deprecated: true,
  preview: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationVersionSelect>()({
    releaseDate: true,
    changelog: true,
    Application: {
      select: {
        id: true,
        name: true,
        providerId: true,
      },
    },
  }),
};

export const publicAppApplicationVersion = router({
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

      applicationVersionEmitter.on('create', onCreate);
      applicationVersionEmitter.on('update', onUpdate);
      applicationVersionEmitter.on('remove', onRemove);
      return () => {
        applicationVersionEmitter.off('create', onCreate);
        applicationVersionEmitter.off('update', onUpdate);
        applicationVersionEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedProviderProcedure
    .input(applicationVersionListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
      try {
        const where: Prisma.ApplicationVersionWhereInput = {
          ...(query
            ? {
                OR: [
                  {
                    version: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    changelog: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
          applicationId: rest.applicationId,
          Application: {
            status: {
              in: [ApplicationStatus.Published, ApplicationStatus.Suspended, ApplicationStatus.Achieved],
            },
          },
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationVersion.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationVersion.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: publicProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationVersion.findUniqueOrThrow({
        where: {
          id,
          Application: {
            status: {
              in: [ApplicationStatus.Published, ApplicationStatus.Suspended, ApplicationStatus.Achieved],
            },
          },
        },
        select: fullSelect,
      });
    } catch (err) {
      throw handleServerError(err);
    }
  }),
});

export const protectedAppApplicationVersion = router({
  list: protectedProviderProcedure
    .input(applicationVersionListInputSchema)
    .query(async ({ ctx: { prisma, session }, input: { limit, skip, cursor, query, ...rest } }) => {
      try {
        const where: Prisma.ApplicationVersionWhereInput = {
          ...(query
            ? {
                OR: [
                  {
                    version: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    changelog: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
          applicationId: rest.applicationId,
          Application: {
            providerId: session.user.id,
            status: {
              not: ApplicationStatus.Deleted,
            },
          },
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationVersion.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationVersion.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  create: protectedProviderProcedure
    .input(applicationVersionCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const result = await prisma.applicationVersion.create({
          data: input,
          select: defaultSelect,
        });
        applicationVersionEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});

export const publicDashboardApplicationVersion = router({});

export const protectedDashboardApplicationVersion = router({
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

      applicationVersionEmitter.on('create', onCreate);
      applicationVersionEmitter.on('update', onUpdate);
      applicationVersionEmitter.on('remove', onRemove);
      return () => {
        applicationVersionEmitter.off('create', onCreate);
        applicationVersionEmitter.off('update', onUpdate);
        applicationVersionEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationVersionListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
      try {
        const where: Prisma.ApplicationVersionWhereInput = {
          ...(query
            ? {
                OR: [
                  {
                    version: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    changelog: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {}),
          applicationId: rest.applicationId,
        };

        const [items, total] = await prisma.$transaction([
          prisma.applicationVersion.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.applicationVersion.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  getById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.applicationVersion.findUniqueOrThrow({
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
    .input(applicationVersionUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.applicationVersion.update({
          where: {
            id,
          },
          data: input,
        });
        applicationVersionEmitter.emit('update', id);
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
        await prisma.applicationVersion.delete({
          where: {
            id,
          },
        });
        applicationVersionEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
});
