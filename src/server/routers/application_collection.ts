import { ApplicationStatus, Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationCollectionEmitter } from '../modules';
import {
  IdSchema,
  applicationCollectionCreateInputSchema,
  applicationCollectionListInputSchema,
  applicationCollectionUpdateInputSchema,
  idSchema,
  mutationOutputSchema,
} from '../schemas';
import {
  protectedAdminProcedure,
  protectedProviderProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.ApplicationCollectionSelect>()({
  id: true,
  name: true,
  description: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationCollectionSelect>()({
    price: true,
    providerId: true,
    Applications: {
      select: {
        id: true,
        name: true,
        providerId: true,
      },
    },
  }),
};

export const publicAppApplicationCollection = router({
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

      applicationCollectionEmitter.on('create', onCreate);
      applicationCollectionEmitter.on('update', onUpdate);
      applicationCollectionEmitter.on('remove', onRemove);
      return () => {
        applicationCollectionEmitter.off('create', onCreate);
        applicationCollectionEmitter.off('update', onUpdate);
        applicationCollectionEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(applicationCollectionListInputSchema)
    .query(
      async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
        try {
          const where: Prisma.ApplicationCollectionWhereInput = {
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
          };

          const [items, total] = await prisma.$transaction([
            prisma.applicationCollection.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.applicationCollection.count({ where }),
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
        return await prisma.applicationCollection.findUniqueOrThrow({
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

export const protectedAppApplicationCollection = router({
  create: protectedProviderProcedure
    .input(applicationCollectionCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { name, description, price, applications },
      }) => {
        try {
          // TODO: It should be checked if the application is provided by the user
          const result = await prisma.applicationCollection.create({
            data: {
              providerId: session.user.id,
              name,
              description,
              price,
              Applications: {
                connect: applications.map((id) => ({
                  id,
                  providerId: session.user.id,
                  status: ApplicationStatus.Published,
                })),
              },
              Followers: {
                connect: {
                  id: session.user.id,
                },
              },
              Owners: {
                connect: {
                  id: session.user.id,
                },
              },
            },
            select: defaultSelect,
          });
          applicationCollectionEmitter.emit('create', result.id);
          return true;
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  updateById: protectedProviderProcedure
    .input(applicationCollectionUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { id, ...input } }) => {
      try {
        const result = await prisma.applicationCollection.update({
          where: { id },
          data: {
            providerId: session.user.id,
            ...input,
          },
          select: defaultSelect,
        });
        applicationCollectionEmitter.emit('update', result.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  removeById: protectedProviderProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        // TODO: It should be checked if the application collection has more than one follower or owner
        await prisma.applicationCollection.delete({
          where: {
            id,
            providerId: session.user.id,
          },
        });
        applicationCollectionEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  followById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.applicationCollection.update({
          where: { id },
          data: {
            Followers: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        applicationCollectionEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  ownById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        // TODO: It should be checked if the user can pay for the application collection
        await prisma.applicationCollection.update({
          where: { id },
          data: {
            Owners: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        applicationCollectionEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const publicDashboardApplicationCollection = router({});

export const protectedDashboardApplicationCollection = router({
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

      applicationCollectionEmitter.on('create', onCreate);
      applicationCollectionEmitter.on('update', onUpdate);
      applicationCollectionEmitter.on('remove', onRemove);
      return () => {
        applicationCollectionEmitter.off('create', onCreate);
        applicationCollectionEmitter.off('update', onUpdate);
        applicationCollectionEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationCollectionListInputSchema)
    .query(
      async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
        try {
          const where: Prisma.ApplicationCollectionWhereInput = {
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
          };

          const [items, total] = await prisma.$transaction([
            prisma.applicationCollection.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.applicationCollection.count({ where }),
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
        return await prisma.applicationCollection.findUniqueOrThrow({
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
    .input(applicationCollectionUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.applicationCollection.update({
          where: {
            id,
          },
          data: input,
        });
        applicationCollectionEmitter.emit('update', id);
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
        // TODO: It should be checked if the application collection has more than one follower or owner
        await prisma.applicationCollection.delete({
          where: {
            id,
          },
        });
        applicationCollectionEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
