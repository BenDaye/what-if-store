import { Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { authorEmitter } from '../modules';
import {
  IdSchema,
  authorCreateProfileInputSchema,
  authorListInputSchema,
  authorUpdateProfileInputSchema,
  authorUpdateProfileInputSchemaForAdmin,
  idSchema,
} from '../schemas';
import {
  protectedAdminProcedure,
  protectedAuthorProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

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
  list: publicProcedure
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
  getById: publicProcedure
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
});

export const protectedAppAuthor = router({
  get: protectedAuthorProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      return await prisma.author.findUniqueOrThrow({
        where: { userId: session.user.id },
        select: fullSelect,
      });
    } catch (err) {
      throw onError(err);
    }
  }),
  update: protectedAuthorProcedure
    .input(authorUpdateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        await prisma.author.update({
          where: { userId: session.user.id },
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
        });
        authorEmitter.emit('update', session.user.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  create: protectedUserProcedure
    .input(authorCreateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        const isAuthor = await prisma.author.findFirst({
          where: {
            userId: session.user.id,
          },
        });
        if (isAuthor) throw new Error('Author already exists');

        const author = await prisma.author.create({
          data: {
            name: input.name,
            type: input.type,
            verified: false,
            userId: session.user.id,
            AuthorProfile: {
              create: {
                email: input.email,
                bio: input.bio,
                website: input.website,
                avatar: input.avatar,
              },
            },
          },
        });
        authorEmitter.emit('create', author.id);
        return true;
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
  getById: protectedAdminProcedure
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
  updateById: protectedAdminProcedure
    .input(authorUpdateProfileInputSchemaForAdmin)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.author.update({
          where: { id },
          data: {
            name: input.name,
            type: input.type,
            verified: input.verified,
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
        });
        authorEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
