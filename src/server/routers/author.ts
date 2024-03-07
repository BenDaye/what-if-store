import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { authorEmitter } from '../modules';
import {
  authorListInputSchema,
  authorUpdateProfileInputSchema,
} from '../schemas';
import { IdSchema, idSchema } from '../schemas/id';
import {
  protectedAdminProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import {
  CommonTRPCError,
  formatListArgs,
  formatListResponse,
  onError,
} from '../utils';

const defaultSelect = Prisma.validator<Prisma.AuthorSelect>()({
  id: true,
  userId: true,
  type: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.AuthorSelect>()({
    name: true,
    AuthorProfile: {
      select: {
        email: true,
        bio: true,
        website: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    _count: {
      select: {
        Application: true,
      },
    },
  }),
};

export const publicAppAuthor = router({
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

      authorEmitter.on('create', onCreate);
      authorEmitter.on('update', onUpdate);
      authorEmitter.on('remove', onRemove);
      return () => {
        authorEmitter.off('create', onCreate);
        authorEmitter.off('update', onUpdate);
        authorEmitter.off('remove', onRemove);
      };
    });
  }),
});

export const protectedAppAuthor = router({
  getProfile: protectedUserProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
        return await prisma.author.findUniqueOrThrow({
          where: { id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateProfile: protectedUserProcedure
    .input(authorUpdateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
        await prisma.user.update({
          where: { id: session.user?.id },
          data: {
            Author: {
              update: {
                data: {
                  name: input.name,
                  AuthorProfile: {
                    update: {
                      data: {
                        email: input.email,
                        bio: input.bio,
                        website: input.website,
                        avatar: input.avatar,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        authorEmitter.emit('update', session.user?.id);
        return input;
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const publicDashboardAuthor = router({});

export const protectedDashboardAuthor = router({
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

      authorEmitter.on('create', onCreate);
      authorEmitter.on('update', onUpdate);
      authorEmitter.on('remove', onRemove);
      return () => {
        authorEmitter.off('create', onCreate);
        authorEmitter.off('update', onUpdate);
        authorEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(authorListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.AuthorWhereInput = {
            ...(query
              ? {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                }
              : {}),
            ...(rest.type?.length
              ? {
                  type: {
                    in: rest.type,
                  },
                }
              : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.author.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.author.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  getProfileById: protectedAdminProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.author.findUniqueOrThrow({
          where: { id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateProfileById: protectedAdminProcedure
    .input(
      authorUpdateProfileInputSchema.extend({
        id: idSchema,
      }),
    )
    .mutation(async ({ ctx: { prisma }, input: { id, ...rest } }) => {
      try {
        await prisma.author.update({
          where: { id },
          data: {
            name: rest.name,
            AuthorProfile: {
              update: {
                data: {
                  email: rest.email,
                  bio: rest.bio,
                  website: rest.website,
                  avatar: rest.avatar,
                },
              },
            },
          },
        });
        authorEmitter.emit('update', id);
        return rest;
      } catch (err) {
        throw onError(err);
      }
    }),
});
