import {
  ApplicationAssetType,
  ApplicationStatus,
  Prisma,
} from '@prisma/client';
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
  description: true,
  category: true,
  price: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      Followers: true,
      Owners: true,
      Collections: true,
      Groups: true,
      Tags: true,
      VersionHistories: true,
      Assets: true,
    },
  },
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ApplicationSelect>()({
    Provider: {
      select: {
        id: true,
      },
    },
    Information: {
      select: {
        platforms: true,
        compatibility: true,
        ageRating: true,
        countries: true,
        locales: true,
        website: true,
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
    Followers: {
      select: { id: true },
    },
    Owners: {
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
    Assets: {
      select: {
        id: true,
        type: true,
        name: true,
        isPrimary: true,
        isLocal: true,
        url: true,
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
                      description: {
                        contains: query,
                        mode: 'insensitive',
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
            ...(rest.status?.length
              ? {
                  status: {
                    in: rest.status.filter(
                      (status) =>
                        status === ApplicationStatus.Published ||
                        status === ApplicationStatus.Suspended ||
                        status === ApplicationStatus.Achieved,
                    ),
                  },
                }
              : {
                  status: {
                    in: [
                      ApplicationStatus.Published,
                      ApplicationStatus.Suspended,
                      ApplicationStatus.Achieved,
                    ],
                  },
                }),
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
              in: [
                ApplicationStatus.Published,
                ApplicationStatus.Suspended,
                ApplicationStatus.Achieved,
              ],
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
                      description: {
                        contains: query,
                        mode: 'insensitive',
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
            description: input.description,
            category: input.category,
            price: input.price,
            Information: {
              create: {
                platforms: input.platforms,
                compatibility: input.compatibility,
                ageRating: input.ageRating,
                countries: input.countries,
                locales: input.locales,
                website: input.website,
                github: input.github,
              },
            },
            Owners: {
              connect: {
                id: session.user.id,
              },
            },
            Followers: {
              connect: {
                id: session.user.id,
              },
            },
            Tags: {
              connect: input.tags,
            },
            Assets: {
              createMany: {
                skipDuplicates: true,
                data: [
                  {
                    type: ApplicationAssetType.File,
                    url: '',
                    name: 'PrivacyPolicy',
                  },
                  {
                    type: ApplicationAssetType.File,
                    url: '',
                    name: 'TermsOfUse',
                  },
                  {
                    type: ApplicationAssetType.File,
                    url: '',
                    name: 'Copyright',
                  },
                  {
                    type: ApplicationAssetType.File,
                    url: '',
                    name: 'Readme',
                  },
                ],
              },
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
        // TODO: It should be checked if the application is editable.
        await prisma.application.update({
          where: {
            id,
            providerId: session.user.id,
            status: { not: ApplicationStatus.Deleted },
          },
          data: {
            name: input.name,
            description: input.description,
            category: input.category,
            price: input.price,
            Information: {
              update: {
                platforms: input.platforms,
                compatibility: input.compatibility,
                ageRating: input.ageRating,
                countries: input.countries,
                locales: input.locales,
                website: input.website,
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
          where: {
            id,
            status: {
              in: [
                ApplicationStatus.Published,
                ApplicationStatus.Suspended,
                ApplicationStatus.Achieved,
              ],
            },
          },
          data: {
            Followers: {
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
            Followers: {
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
          where: { id, status: { equals: ApplicationStatus.Published } },
          data: {
            Owners: {
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
                      description: {
                        contains: query,
                        mode: 'insensitive',
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
            ...(rest.status?.length
              ? {
                  status: {
                    in: rest.status,
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
            description: input.description,
            category: input.category,
            price: input.price,
            Information: {
              update: {
                platforms: input.platforms,
                compatibility: input.compatibility,
                ageRating: input.ageRating,
                countries: input.countries,
                locales: input.locales,
                website: input.website,
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
            Followers: {
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
            Owners: {
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
