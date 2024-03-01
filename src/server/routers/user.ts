import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { userEmitter } from '../modules';
import { IdSchema, idSchema } from '../schemas/id';
import {
  userListInputSchema,
  userUpdateProfileInputSchema,
} from '../schemas/user';
import {
  protectedAdminProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { CommonTRPCError, onError } from '../utils/errors';
import { formatListArgs, formatListResponse } from '../utils/format';

const defaultAppInclude = Prisma.validator<Prisma.UserInclude>()({
  UserProfile: true,
});

const fullAppInclude = Prisma.validator<Prisma.UserInclude>()({
  UserProfile: true,
});

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
});

export const protectedAppUser = router({
  getProfile: protectedUserProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
        return await prisma.user.findUniqueOrThrow({
          where: { id: session.user?.id },
          include: fullAppInclude,
        });
      } catch (err) {
        throw onError(err);
      }
    },
  ),
  updateProfile: protectedUserProcedure
    .input(userUpdateProfileInputSchema)
    .mutation(
      async ({ ctx: { prisma, session }, input: { nickname, email } }) => {
        try {
          if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
          await prisma.user.update({
            where: { id: session.user?.id },
            data: {
              UserProfile: {
                update: {
                  data: {
                    nickname,
                    email,
                  },
                },
              },
            },
          });
          userEmitter.emit('update', session.user?.id);
          return { nickname, email };
        } catch (err) {
          throw onError(err);
        }
      },
    ),
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
              include: defaultAppInclude,
            }),
            prisma.user.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  getProfile: protectedAdminProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
        return await prisma.user.findUniqueOrThrow({
          where: { id: session.user?.id },
          include: fullAppInclude,
        });
      } catch (err) {
        throw onError(err);
      }
    },
  ),
  getProfileById: protectedAdminProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
        return await prisma.user.findUniqueOrThrow({
          where: { id },
          include: fullAppInclude,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateProfile: protectedAdminProcedure
    .input(userUpdateProfileInputSchema)
    .mutation(
      async ({ ctx: { prisma, session }, input: { nickname, email } }) => {
        try {
          if (!session.user?.id) throw new CommonTRPCError('UNAUTHORIZED');
          await prisma.user.update({
            where: { id: session.user?.id || undefined },
            data: {
              UserProfile: {
                update: {
                  data: {
                    nickname,
                    email,
                  },
                },
              },
            },
          });
          userEmitter.emit('update', session.user?.id);
          return { nickname, email };
        } catch (err) {
          throw onError(err);
        }
      },
    ),
});
