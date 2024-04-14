import { AuthRole, Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { userEmitter } from '../modules';
import { IdSchema, idSchema } from '../schemas';
import {
  userListInputSchema,
  userUpdateProfileInputSchema,
  userUpdateProfileInputSchemaForAdmin,
} from '../schemas/user';
import {
  protectedAdminProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.UserSelect>()({
    username: true,
    UserProfile: {
      select: {
        nickname: true,
        email: true,
        avatar: true,
        bio: true,
      },
    },
    ProviderProfile: {
      select: {
        id: true,
        type: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        website: true,
      },
    },
    _count: {
      select: {
        ProvidingApplications: true,
        OwningApplications: true,
        FollowingApplications: true,
        ProvidingCollections: true,
        OwningCollections: true,
        FollowingCollections: true,
        FollowingUsers: true,
        Followers: true,
        ApiKeys: true,
      },
    },
  }),
};

export const publicAppUser = router({
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

      userEmitter.on('create', onCreate);
      userEmitter.on('update', onUpdate);
      userEmitter.on('remove', onRemove);
      return () => {
        userEmitter.off('create', onCreate);
        userEmitter.off('update', onUpdate);
        userEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(userListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.UserWhereInput = {
            ...(query
              ? {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                }
              : {}),
            ...(rest.role?.length
              ? {
                  role: {
                    in: rest.role,
                  },
                }
              : {}),
            role: {
              not: AuthRole.Admin,
            },
          };

          const [items, total] = await prisma.$transaction([
            prisma.user.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.user.count({ where }),
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
        return await prisma.user.findUniqueOrThrow({
          where: {
            id,
            role: {
              not: AuthRole.Admin,
            },
          },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const protectedAppUser = router({
  get: protectedUserProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      return await prisma.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: fullSelect,
      });
    } catch (err) {
      throw onError(err);
    }
  }),
  update: protectedUserProcedure
    .input(userUpdateProfileInputSchema)
    .output(userUpdateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            UserProfile: {
              update: {
                data: {
                  nickname: input.nickname,
                  email: input.email,
                  avatar: input.avatar,
                  bio: input.bio,
                },
              },
            },
          },
        });
        userEmitter.emit('update', session.user.id);
        // NOTE: Typically mutation should only return "true", but we return the input for client side to call "updateSession"
        return input;
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const publicDashboardUser = router({});

export const protectedDashboardUser = router({
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

      userEmitter.on('create', onCreate);
      userEmitter.on('update', onUpdate);
      userEmitter.on('remove', onRemove);
      return () => {
        userEmitter.off('create', onCreate);
        userEmitter.off('update', onUpdate);
        userEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(userListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.UserWhereInput = {
            ...(query
              ? {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                }
              : {}),
            ...(rest.role?.length
              ? {
                  role: {
                    in: rest.role,
                  },
                }
              : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.user.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.user.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  get: protectedAdminProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      return await prisma.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: fullSelect,
      });
    } catch (err) {
      throw onError(err);
    }
  }),
  update: protectedAdminProcedure
    .input(userUpdateProfileInputSchema)
    .output(userUpdateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            UserProfile: {
              update: {
                data: {
                  nickname: input.nickname,
                  email: input.email,
                  avatar: input.avatar,
                  bio: input.bio,
                },
              },
            },
          },
        });
        userEmitter.emit('update', session.user.id);
        // NOTE: Typically mutation should only return "true", but we return the input for client side to call "updateSession"
        return input;
      } catch (err) {
        throw onError(err);
      }
    }),
  getById: protectedAdminProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma }, input: id }) => {
      try {
        return await prisma.user.findUniqueOrThrow({
          where: { id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateById: protectedAdminProcedure
    .input(userUpdateProfileInputSchemaForAdmin)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.user.update({
          where: { id },
          data: {
            role: input.role,
            UserProfile: {
              update: {
                data: {
                  nickname: input.nickname,
                  email: input.email,
                  avatar: input.avatar,
                  bio: input.bio,
                },
              },
            },
          },
        });
        userEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
