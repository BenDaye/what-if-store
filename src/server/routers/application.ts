import { ApplicationStatus, Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationEmitter } from '../modules';
import {
  IdSchema,
  applicationListInputSchema,
  applicationUpdateInputSchema,
  idSchema,
} from '../schemas';
import {
  protectedAdminProcedure,
  protectedProviderProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.ApplicationSelect>()({
  id: true,
  providerId: true,
  name: true,
  category: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationSelect>()({
    platforms: true,
    countries: true,
    ageRating: true,
    price: true,
    Provider: {
      select: {
        id: true,
      },
    },
    Information: {
      select: {
        description: true,
        website: true,
        logo: true,
        screenshots: true,
        compatibility: true,
        languages: true,
        copyright: true,
        privacyPolicy: true,
        termsOfUse: true,
        github: true,
      },
    },
    VersionHistories: {
      select: {
        id: true,
        version: true,
        releaseDate: true,
        changelog: true,
        latest: true,
        deprecated: true,
        preview: true,
      },
    },
  }),
};

export const publicAppApplication = router({
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

      applicationEmitter.on('create', onCreate);
      applicationEmitter.on('update', onUpdate);
      applicationEmitter.on('remove', onRemove);
      return () => {
        applicationEmitter.off('create', onCreate);
        applicationEmitter.off('update', onUpdate);
        applicationEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(applicationListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ApplicationWhereInput = {
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
                      Information: {
                        description: {
                          contains: query,
                          mode: 'insensitive',
                        },
                      },
                    },
                  ],
                }
              : {}),
            ...(rest.category?.length
              ? {
                  category: {
                    in: rest.category,
                  },
                }
              : {}),
            ...(rest.platform
              ? {
                  platforms: {
                    has: rest.platform,
                  },
                }
              : {}),
            ...(rest.language
              ? {
                  languages: {
                    has: rest.language,
                  },
                }
              : {}),
            status: {
              in: [ApplicationStatus.Published, ApplicationStatus.Suspended],
            },
          };

          const [items, total] = await prisma.$transaction([
            prisma.application.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.application.count({ where }),
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
        return await prisma.application.findUniqueOrThrow({
          where: {
            id,
            status: {
              in: [ApplicationStatus.Published, ApplicationStatus.Suspended],
            },
          },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const protectedAppApplication = router({
  list: protectedProviderProcedure
    .input(applicationListInputSchema)
    .query(
      async ({
        ctx: { prisma, session },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ApplicationWhereInput = {
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
                      Information: {
                        description: {
                          contains: query,
                          mode: 'insensitive',
                        },
                      },
                    },
                  ],
                }
              : {}),
            ...(rest.category?.length
              ? {
                  category: {
                    in: rest.category,
                  },
                }
              : {}),
            ...(rest.platform
              ? {
                  platforms: {
                    has: rest.platform,
                  },
                }
              : {}),
            ...(rest.language
              ? {
                  languages: {
                    has: rest.language,
                  },
                }
              : {}),
            Provider: {
              id: session.user.id,
            },
          };

          const [items, total] = await prisma.$transaction([
            prisma.application.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.application.count({ where }),
          ]);
          return formatListResponse(items, limit, total);
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  getById: protectedProviderProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        return await prisma.application.findUniqueOrThrow({
          where: { id, providerId: session.user.id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateById: protectedProviderProcedure
    .input(applicationUpdateInputSchema.extend({ id: idSchema }))
    .mutation(async ({ ctx: { prisma, session }, input: { id, ...input } }) => {
      try {
        await prisma.application.update({
          where: { id, providerId: session.user.id },
          data: {
            name: input.name,
            category: input.category,
            platforms: input.platforms,
            countries: input.countries,
            ageRating: input.ageRating,
            Information: {
              update: {
                data: {
                  description: input.description,
                  website: input.website,
                  logo: input.logo,
                  screenshots: input.screenshots,
                  compatibility: input.compatibility,
                  languages: input.languages,
                  privacyPolicy: input.privacyPolicy,
                  termsOfUse: input.termsOfUse,
                  github: input.github,
                },
              },
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  // TODO: applyToChangeStatus bullmq
  // applyToChangeStatus: protectedProviderProcedure.input(String).mutation(),
});

export const publicDashboardApplication = router({});

export const protectedDashboardApplication = router({
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

      applicationEmitter.on('create', onCreate);
      applicationEmitter.on('update', onUpdate);
      applicationEmitter.on('remove', onRemove);
      return () => {
        applicationEmitter.off('create', onCreate);
        applicationEmitter.off('update', onUpdate);
        applicationEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(applicationListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ApplicationWhereInput = {
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
                      Information: {
                        description: {
                          contains: query,
                          mode: 'insensitive',
                        },
                      },
                    },
                  ],
                }
              : {}),
            ...(rest.category?.length
              ? {
                  category: {
                    in: rest.category,
                  },
                }
              : {}),
            ...(rest.platform
              ? {
                  platforms: {
                    has: rest.platform,
                  },
                }
              : {}),
            ...(rest.language
              ? {
                  languages: {
                    has: rest.language,
                  },
                }
              : {}),
          };

          const [items, total] = await prisma.$transaction([
            prisma.application.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.application.count({ where }),
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
        return await prisma.application.findUniqueOrThrow({
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
    .input(applicationUpdateInputSchema.extend({ id: idSchema }))
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.application.update({
          where: { id },
          data: {
            name: input.name,
            category: input.category,
            platforms: input.platforms,
            countries: input.countries,
            ageRating: input.ageRating,
            Information: {
              update: {
                data: {
                  description: input.description,
                  website: input.website,
                  logo: input.logo,
                  screenshots: input.screenshots,
                  compatibility: input.compatibility,
                  languages: input.languages,
                  privacyPolicy: input.privacyPolicy,
                  termsOfUse: input.termsOfUse,
                  github: input.github,
                },
              },
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  // TODO: replyToChangeStatus bullmq
});
