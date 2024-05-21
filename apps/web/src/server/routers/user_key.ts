import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { userApiKeyEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import { idSchema } from '../schemas';
import { userApiKeyCreateInputSchema, userApiKeyListInputSchema } from '../schemas/user_key';
import { protectedAdminProcedure, protectedUserProcedure, router } from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.UserApiKeySelect>()({
  id: true,
  userId: true,
  remark: true,
  createdAt: true,
  updatedAt: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.UserApiKeySelect>()({
    key: true,
  }),
};

export const publicAppUserApiKey = router({});

export const protectedAppUserApiKey = router({
  subscribe: protectedUserProcedure.subscription(() => {
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

      userApiKeyEmitter.on('create', onCreate);
      userApiKeyEmitter.on('update', onUpdate);
      userApiKeyEmitter.on('remove', onRemove);
      return () => {
        userApiKeyEmitter.off('create', onCreate);
        userApiKeyEmitter.off('update', onUpdate);
        userApiKeyEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedUserProcedure
    .input(userApiKeyListInputSchema)
    .query(async ({ ctx: { prisma, session }, input: { limit, skip, cursor, query } }) => {
      try {
        const where: Prisma.UserApiKeyWhereInput = {
          ...(query
            ? {
                remark: {
                  contains: query,
                  mode: 'insensitive',
                },
              }
            : {}),
          userId: {
            equals: session.user.id,
          },
        };

        const [items, total] = await prisma.$transaction([
          prisma.userApiKey.findMany({
            where,
            ...formatListArgs(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.userApiKey.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw onError(err);
      }
    }),
  create: protectedUserProcedure
    .input(userApiKeyCreateInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { remark } }) => {
      try {
        const result = await prisma.userApiKey.create({
          data: {
            userId: session.user.id,
            remark,
          },
          select: fullSelect,
        });
        userApiKeyEmitter.emit('create', result.id);
        return result;
      } catch (err) {
        throw onError(err);
      }
    }),
  removeById: protectedUserProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.userApiKey.delete({
          where: {
            id,
            userId: session.user.id,
          },
        });
        userApiKeyEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const publicDashboardUserApiKey = router({});

export const protectedDashboardUserApiKey = router({
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

      userApiKeyEmitter.on('create', onCreate);
      userApiKeyEmitter.on('update', onUpdate);
      userApiKeyEmitter.on('remove', onRemove);
      return () => {
        userApiKeyEmitter.off('create', onCreate);
        userApiKeyEmitter.off('update', onUpdate);
        userApiKeyEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(userApiKeyListInputSchema)
    .query(async ({ ctx: { prisma, session }, input: { limit, skip, cursor, query } }) => {
      try {
        const where: Prisma.UserApiKeyWhereInput = {
          ...(query
            ? {
                remark: {
                  contains: query,
                  mode: 'insensitive',
                },
              }
            : {}),
          userId: {
            equals: session.user.id,
          },
        };

        const [items, total] = await prisma.$transaction([
          prisma.userApiKey.findMany({
            where,
            ...formatListArgs(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.userApiKey.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw onError(err);
      }
    }),
  listAll: protectedAdminProcedure
    .input(userApiKeyListInputSchema)
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query } }) => {
      try {
        const where: Prisma.UserApiKeyWhereInput = {
          ...(query
            ? {
                remark: {
                  contains: query,
                  mode: 'insensitive',
                },
              }
            : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.userApiKey.findMany({
            where,
            ...formatListArgs(limit, skip, cursor),
            orderBy: [
              {
                createdAt: 'asc',
              },
            ],
            select: defaultSelect,
          }),
          prisma.userApiKey.count({ where }),
        ]);
        return formatListResponse(items, limit, total);
      } catch (err) {
        throw onError(err);
      }
    }),
  create: protectedAdminProcedure
    .input(userApiKeyCreateInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { remark } }) => {
      try {
        const result = await prisma.userApiKey.create({
          data: {
            userId: session.user.id,
            remark,
          },
          select: fullSelect,
        });
        userApiKeyEmitter.emit('create', result.id);
        return result;
      } catch (err) {
        throw onError(err);
      }
    }),
  removeById: protectedAdminProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.userApiKey.delete({
          where: {
            id,
            userId: session.user.id,
          },
        });
        userApiKeyEmitter.emit('remove', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
