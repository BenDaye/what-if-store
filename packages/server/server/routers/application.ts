import { ApplicationAssetType, ApplicationStatus, Prisma } from '@what-if-store/prisma/client';
import { formatListRequest, formatListResponse, handleServerError } from '@what-if-store/utils';
import { observable } from '@trpc/server/observable';
import { applicationChangeStatusQueue, applicationEmitter } from '../modules';
import type { IdSchema } from '../schemas';
import {
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

const defaultSelect = Prisma.validator<Prisma.ApplicationSelect>()({
  id: true,
  providerId: true,
  name: true,
  description: true,
  category: true,
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
  Information: {
    select: {
      platforms: true,
      ageRating: true,
      countries: true,
      locales: true,
    },
  },
  Price: {
    select: {
      id: true,
      price: true,
      country: true,
      currency: true,
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
      select: { userId: true, createdAt: true },
    },
    Owners: {
      select: { userId: true, createdAt: true },
    },
    Collections: {
      select: {
        id: true,
        name: true,
      },
    },
    Groups: {
      select: {
        id: true,
        name: true,
      },
    },
    Tags: {
      select: {
        id: true,
        name: true,
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
    PriceHistories: {
      select: {
        id: true,
        price: true,
        country: true,
        currency: true,
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
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
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
          ...(rest.platforms?.length
            ? {
                Information: {
                  platforms: {
                    hasSome: rest.platforms,
                  },
                },
              }
            : {}),
          ...(rest.locales?.length
            ? {
                Information: {
                  locales: {
                    hasSome: rest.locales,
                  },
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
                  in: [ApplicationStatus.Published, ApplicationStatus.Suspended, ApplicationStatus.Achieved],
                },
              }),
          ...(rest.countries?.length
            ? {
                Information: {
                  countries: {
                    hasSome: rest.countries,
                  },
                },
              }
            : {}),
          ...(rest.ageRating
            ? {
                Information: {
                  ageRating: {
                    equals: rest.ageRating,
                  },
                },
              }
            : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.application.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
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
        throw handleServerError(err);
      }
    }),
  getById: publicProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.application.findUniqueOrThrow({
        where: {
          id,
          status: {
            in: [ApplicationStatus.Published, ApplicationStatus.Suspended, ApplicationStatus.Achieved],
          },
        },
        select: fullSelect,
      });
    } catch (err) {
      throw handleServerError(err);
    }
  }),
});

export const protectedAppApplication = router({
  list: protectedProviderProcedure
    .input(applicationListInputSchema)
    .query(async ({ ctx: { prisma, session }, input: { limit, skip, cursor, query, ...rest } }) => {
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
          ...(rest.platforms?.length
            ? {
                Information: {
                  platforms: {
                    hasSome: rest.platforms,
                  },
                },
              }
            : {}),
          ...(rest.locales
            ? {
                Information: {
                  locales: {
                    hasSome: rest.locales,
                  },
                },
              }
            : {}),
          ...(rest.countries?.length
            ? {
                Information: {
                  countries: {
                    hasSome: rest.countries,
                  },
                },
              }
            : {}),
          ...(rest.ageRating
            ? {
                Information: {
                  ageRating: {
                    equals: rest.ageRating,
                  },
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
            ...formatListRequest(limit, skip, cursor),
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
        throw handleServerError(err);
      }
    }),
  create: protectedProviderProcedure
    .input(applicationCreateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        await prisma.$transaction(async (tx) => {
          const exists = await tx.application.findFirst({
            where: {
              name: input.name,
              providerId: session.user.id,
              status: { not: ApplicationStatus.Deleted },
            },
          });
          if (exists) throw new Error('Application already exists');
          const creation = await tx.application.create({
            data: {
              providerId: session.user.id,
              name: input.name,
              description: input.description,
              category: input.category,
              // price: input.price,
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
              Price: {
                createMany: {
                  skipDuplicates: true,
                  data: input.price,
                },
              },
              PriceHistories: {
                createMany: {
                  skipDuplicates: true,
                  data: input.price,
                },
              },
            },
            select: defaultSelect,
          });
          await tx.application.update({
            where: {
              id: creation.id,
            },
            data: {
              Followers: {
                set: [
                  {
                    applicationId_userId: {
                      userId: session.user.id,
                      applicationId: creation.id,
                    },
                  },
                ],
              },
            },
          });
          applicationEmitter.emit('create', creation.id);
        });
        return true;
      } catch (err) {
        throw handleServerError(err);
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
            request: request ?? `Change status to ${status} by ${session.user.id}`,
          },
          {
            // NOTE: https://docs.bullmq.io/patterns/throttle-jobs
            jobId: id,
          },
        );
        return true;
      } catch (err) {
        throw handleServerError(err);
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
        throw handleServerError(err);
      }
    }),
  updateById: protectedProviderProcedure
    .input(applicationUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { id, ...input } }) => {
      try {
        // TODO: It should be checked if the application is editable.
        await prisma.$transaction(async (tx) => {
          const exists = await tx.application.findFirst({
            where: {
              id,
              providerId: session.user.id,
              status: { not: ApplicationStatus.Deleted },
            },
            select: defaultSelect,
          });
          if (!exists) throw new Error('Application not found');

          await tx.application.update({
            where: {
              id,
              providerId: session.user.id,
              status: { not: ApplicationStatus.Deleted },
            },
            data: {
              name: input.name,
              description: input.description,
              category: input.category,
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

          if (input.price) {
            for await (const next of input.price) {
              const created = exists.Price.find((price) => price.country === next.country);
              if (!created) {
                await tx.application.update({
                  where: {
                    id,
                    providerId: session.user.id,
                    status: { not: ApplicationStatus.Deleted },
                    Information: {
                      countries: {
                        has: next.country,
                      },
                    },
                  },
                  data: {
                    Price: {
                      create: next,
                    },
                    PriceHistories: {
                      create: next,
                    },
                  },
                });
              } else {
                if (created.price === next.price && created.currency === next.currency) continue;

                await tx.application.update({
                  where: {
                    id,
                    providerId: session.user.id,
                    status: { not: ApplicationStatus.Deleted },
                    Information: {
                      countries: {
                        has: next.country,
                      },
                    },
                  },
                  data: {
                    Price: {
                      update: {
                        where: {
                          id: created.id,
                          country: next.country,
                        },
                        data: next,
                      },
                    },
                    PriceHistories: {
                      create: next,
                    },
                  },
                });
              }
            }
          }

          applicationEmitter.emit('update', id);
        });
        return true;
      } catch (err) {
        throw handleServerError(err);
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
        throw handleServerError(err);
      }
    }),
  isFollowedById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        const exists = await prisma.applicationFollow.findFirst({
          where: {
            applicationId: id,
            userId: session.user.id,
          },
        });
        return Boolean(exists);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  followedList: protectedUserProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      return await prisma.applicationFollow.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          applicationId: true,
        },
      });
    } catch (err) {
      throw handleServerError(err);
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
              in: [ApplicationStatus.Published, ApplicationStatus.Suspended, ApplicationStatus.Achieved],
            },
          },
          data: {
            Followers: {
              create: {
                userId: session.user.id,
              },
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  unfollowById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.applicationFollow.delete({
          where: {
            applicationId_userId: {
              applicationId: id,
              userId: session.user.id,
            },
          },
        });
        applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  isOwnedById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        const exists = await prisma.applicationOwn.findFirst({
          where: {
            applicationId: id,
            userId: session.user.id,
          },
        });
        return Boolean(exists);
      } catch (err) {
        throw handleServerError(err);
      }
    }),
  ownedList: protectedUserProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      return await prisma.applicationOwn.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          applicationId: true,
        },
      });
    } catch (err) {
      throw handleServerError(err);
    }
  }),
  ownById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    // .mutation(async ({ ctx: { prisma, session }, input: id }) => {
    .mutation(async () => {
      try {
        // TODO: It should be checked if the user can pay for the application
        // await prisma.application.update({
        //   where: { id, status: { equals: ApplicationStatus.Published } },
        //   data: {
        //     Owners: {
        //       connect: {
        //         id: session.user.id,
        //       },
        //     },
        //   },
        // });
        // applicationEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw handleServerError(err);
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
    .query(async ({ ctx: { prisma }, input: { limit, skip, cursor, query, ...rest } }) => {
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
          ...(rest.platforms?.length
            ? {
                Information: {
                  platforms: {
                    hasSome: rest.platforms,
                  },
                },
              }
            : {}),
          ...(rest.locales?.length
            ? {
                Information: {
                  locales: {
                    hasSome: rest.locales,
                  },
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
          ...(rest.countries?.length
            ? {
                Information: {
                  countries: {
                    hasSome: rest.countries,
                  },
                },
              }
            : {}),
          ...(rest.ageRating
            ? {
                Information: {
                  ageRating: {
                    equals: rest.ageRating,
                  },
                },
              }
            : {}),
        };

        const [items, total] = await prisma.$transaction([
          prisma.application.findMany({
            where,
            ...formatListRequest(limit, skip, cursor),
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
        throw handleServerError(err);
      }
    }),
  getById: protectedAdminProcedure.input(idSchema).query(async ({ ctx: { prisma }, input: id }) => {
    try {
      return await prisma.application.findUniqueOrThrow({
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
    .input(applicationUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.$transaction(async (tx) => {
          const exists = await tx.application.findFirst({
            where: {
              id,
            },
            select: defaultSelect,
          });
          if (!exists) throw new Error('Application not found');

          await tx.application.update({
            where: {
              id,
            },
            data: {
              name: input.name,
              description: input.description,
              category: input.category,
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

          if (input.price) {
            for await (const next of input.price) {
              const created = exists.Price.find((price) => price.country === next.country);
              if (!created) {
                await tx.application.update({
                  where: {
                    id,
                    Information: {
                      countries: {
                        has: next.country,
                      },
                    },
                  },
                  data: {
                    Price: {
                      create: next,
                    },
                    PriceHistories: {
                      create: next,
                    },
                  },
                });
              } else {
                if (created.price === next.price && created.currency === next.currency) continue;

                await tx.application.update({
                  where: {
                    id,
                    Information: {
                      countries: {
                        has: next.country,
                      },
                    },
                  },
                  data: {
                    Price: {
                      update: {
                        where: {
                          id: created.id,
                          country: next.country,
                        },
                        data: next,
                      },
                    },
                    PriceHistories: {
                      create: next,
                    },
                  },
                });
              }
            }
          }

          applicationEmitter.emit('update', id);
        });
        return true;
      } catch (err) {
        throw handleServerError(err);
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
        throw handleServerError(err);
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
        throw handleServerError(err);
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
        throw handleServerError(err);
      }
    }),
});
