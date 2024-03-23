import { ApplicationStatus, Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationChangeStatusQueue, applicationEmitter } from '../modules';
import {
  IdSchema,
  applicationChangeStatusInputSchema,
  applicationCreateInputSchema,
  applicationListInputSchema,
  applicationUpdateInputSchema,
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

const defaultSelect = Prisma.validator<Prisma.ApplicationSelect>()({
  id: true,
  providerId: true,
  name: true,
  category: true,
  price: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      FollowedByUsers: true,
      OwnedByUsers: true,
      Collections: true,
      Groups: true,
      Tags: true,
      VersionHistories: true,
    },
  },
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationSelect>()({
    platforms: true,
    countries: true,
    ageRating: true,
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
        locales: true,
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
    FollowedByUsers: {
      select: { id: true },
    },
    OwnedByUsers: {
      select: { id: true },
    },
    Collections: {
      select: {
        id: true,
      },
    },
    Groups: {
      select: {
        id: true,
      },
    },
    Tags: {
      select: {
        id: true,
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
                  locales: {
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
                  locales: {
                    has: rest.language,
                  },
                }
              : {}),
            Provider: {
              id: session.user.id,
            },
            status: {
              not: ApplicationStatus.Deleted,
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
  create: protectedProviderProcedure
    .input(applicationCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        const result = await prisma.application.create({
          data: {
            providerId: session.user.id,
            name: input.name,
            category: input.category,
            platforms: input.platforms,
            countries: input.countries,
            ageRating: input.ageRating,
            price: input.price,
            Information: {
              create: {
                description: input.description,
                website: input.website,
                logo: input.logo,
                screenshots: input.screenshots,
                compatibility: input.compatibility,
                locales: input.locales,
                privacyPolicy: input.privacyPolicy,
                termsOfUse: input.termsOfUse,
                github: input.github,
              },
            },
            VersionHistories: {
              create: {
                version: input.version ?? '1.0.0',
                releaseDate: input.releaseDate,
                changelog: input.changelog,
                latest: input.latest,
                deprecated: input.deprecated,
                preview: input.preview,
              },
            },
            OwnedByUsers: {
              connect: {
                id: session.user.id,
              },
            },
            FollowedByUsers: {
              connect: {
                id: session.user.id,
              },
            },
            Tags: {
              connect: input.tags,
            },
          },
          select: defaultSelect,
        });
        applicationEmitter.emit('create', result.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  changeStatusById: protectedProviderProcedure
    .input(applicationChangeStatusInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { session }, input: { id, status, request } }) => {
      try {
        await applicationChangeStatusQueue.add(
          id,
          {
            id,
            userId: session.user.id,
            status,
            reviewerId: session.user.id,
            request:
              request ?? `Change status to ${status} by ${session.user.id}`,
          },
          {
            // NOTE: https://docs.bullmq.io/patterns/throttle-jobs
            jobId: id,
          },
        );
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  getById: protectedProviderProcedure
    .input(idSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        return await prisma.application.findUniqueOrThrow({
          where: {
            id,
            providerId: session.user.id,
            status: { not: ApplicationStatus.Deleted },
          },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateById: protectedProviderProcedure
    .input(applicationUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { id, ...input } }) => {
      try {
        await prisma.application.update({
          where: {
            id,
            providerId: session.user.id,
            status: { not: ApplicationStatus.Deleted },
          },
          data: {
            name: input.name,
            category: input.category,
            platforms: input.platforms,
            countries: input.countries,
            ageRating: input.ageRating,
            price: input.price,
            Information: {
              update: {
                description: input.description,
                website: input.website,
                logo: input.logo,
                screenshots: input.screenshots,
                compatibility: input.compatibility,
                locales: input.locales,
                privacyPolicy: input.privacyPolicy,
                termsOfUse: input.termsOfUse,
                github: input.github,
              },
            },
            Tags: {
              set: input.tags,
            },
          },
        });
        applicationEmitter.emit('update', id);
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
        // TODO: Soft delete, it should be deleted from database in a bullmq task
        await prisma.application.update({
          where: {
            id,
            providerId: session.user.id,
            status: { not: ApplicationStatus.Deleted },
          },
          data: {
            status: ApplicationStatus.Deleted,
          },
        });
        applicationEmitter.emit('remove', id);
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
        await prisma.application.update({
          where: { id, status: ApplicationStatus.Published },
          data: {
            FollowedByUsers: {
              connect: {
                id: session.user.id,
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
  unfollowById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.application.update({
          where: { id },
          data: {
            FollowedByUsers: {
              disconnect: {
                id: session.user.id,
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
  ownById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        // TODO: It should be checked if the user can pay for the application
        await prisma.application.update({
          where: { id, status: ApplicationStatus.Published },
          data: {
            OwnedByUsers: {
              connect: {
                id: session.user.id,
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
  // TODO: Make the application free for a limited time. Use bullmq to schedule the task
  // free: protectedProviderProcedure.input(applicationFreeInputSchema).mutation()
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
                  locales: {
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
    .input(applicationUpdateInputSchema)
    .output(mutationOutputSchema)
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
            price: input.price,
            Information: {
              update: {
                description: input.description,
                website: input.website,
                logo: input.logo,
                screenshots: input.screenshots,
                compatibility: input.compatibility,
                locales: input.locales,
                privacyPolicy: input.privacyPolicy,
                termsOfUse: input.termsOfUse,
                github: input.github,
              },
            },
            Tags: {
              set: input.tags,
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  cleanupFollowersById: protectedAdminProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: id }) => {
      try {
        await prisma.application.update({
          where: {
            id,
          },
          data: {
            FollowedByUsers: {
              set: [],
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  cleanupOwnersById: protectedAdminProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: id }) => {
      try {
        await prisma.application.update({
          where: { id },
          data: {
            OwnedByUsers: {
              set: [],
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  changeStatusById: protectedAdminProcedure
    .input(applicationChangeStatusInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { session }, input: { id, status } }) => {
      try {
        await applicationChangeStatusQueue.add(
          id,
          {
            id,
            userId: session.user.id,
            status,
            reviewerId: session.user.id,
            request: `Change status to ${status} by ${session.user.id}`,
          },
          {
            // NOTE: https://docs.bullmq.io/patterns/throttle-jobs
            jobId: id,
          },
        );
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
});
