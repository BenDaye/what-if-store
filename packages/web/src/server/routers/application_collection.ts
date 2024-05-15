import { ApplicationCollectionStatus, Prisma } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { applicationCollectionEmitter } from '../modules';
import {
  applicationCollectionCreateInputSchema,
  applicationCollectionListInputSchema,
  applicationCollectionUpdateInputSchema,
  IdSchema,
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
  providerId: true,
  status: true,
  _count: {
    select: {
      Followers: true,
      Owners: true,
      Applications: true,
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
  ...Prisma.validator<Prisma.ApplicationCollectionSelect>()({
    Applications: {
      select: {
        id: true,
        name: true,
      },
    },
    Followers: {
      select: {
        userId: true,
        createdAt: true,
      },
    },
    Owners: {
      select: {
        userId: true,
        createdAt: true,
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
          await prisma.$transaction(async (tx) => {
            const exists = await tx.applicationCollection.findFirst({
              where: {
                providerId: session.user.id,
                name,
              },
            });
            if (exists)
              throw new Error('Application collection already exists');

            const creation = await tx.applicationCollection.create({
              data: {
                providerId: session.user.id,
                name,
                description,
                Applications: {
                  connect: applications,
                },
                Price: {
                  createMany: {
                    skipDuplicates: true,
                    data: price,
                  },
                },
                PriceHistories: {
                  createMany: {
                    skipDuplicates: true,
                    data: price,
                  },
                },
              },
            });
            await tx.applicationCollection.update({
              where: {
                id: creation.id,
              },
              data: {
                Followers: {
                  connect: {
                    applicationCollectionId_userId: {
                      applicationCollectionId: creation.id,
                      userId: session.user.id,
                    },
                  },
                },
              },
            });
            applicationCollectionEmitter.emit('create', creation.id);
          });
          return true;
        } catch (err) {
          throw onError(err);
        }
      },
    ),
  updateById: protectedProviderProcedure
    .input(applicationCollectionUpdateInputSchema)
    .output(mutationOutputSchema)
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { id, name, description, price, applications },
      }) => {
        try {
          await prisma.$transaction(async (tx) => {
            const exists = await tx.applicationCollection.findFirst({
              where: {
                id,
                providerId: session.user.id,
                status: {
                  not: ApplicationCollectionStatus.Deleted,
                },
              },
              select: defaultSelect,
            });
            if (!exists) throw new Error('Application collection not found');

            await tx.applicationCollection.update({
              where: {
                id,
              },
              data: {
                name,
                description,
                Applications: {
                  set: applications,
                },
              },
            });
            if (price) {
              for await (const next of price) {
                const created = exists.Price.find(
                  (price) => price.country === next.country,
                );
                if (!created) {
                  await tx.applicationCollection.update({
                    where: {
                      id,
                      providerId: session.user.id,
                      status: {
                        not: ApplicationCollectionStatus.Deleted,
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
                  if (
                    created.price === next.price &&
                    created.currency === next.currency
                  )
                    continue;

                  await tx.applicationCollection.update({
                    where: {
                      id,
                      providerId: session.user.id,
                      status: {
                        not: ApplicationCollectionStatus.Deleted,
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
            applicationCollectionEmitter.emit('update', id);
          });
          return true;
        } catch (err) {
          throw onError(err);
        }
      },
    ),
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
  isFollowedById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        const exists = await prisma.applicationCollectionFollow.findFirst({
          where: {
            applicationCollectionId: id,
            userId: session.user.id,
          },
        });
        return Boolean(exists);
      } catch (err) {
        throw onError(err);
      }
    }),
  followedList: protectedUserProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        return await prisma.applicationCollectionFollow.findMany({
          where: {
            userId: session.user.id,
          },
          select: {
            applicationCollectionId: true,
          },
        });
      } catch (err) {
        throw onError(err);
      }
    },
  ),
  followById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.applicationCollection.update({
          where: { id },
          data: {
            Followers: {
              create: {
                userId: session.user.id,
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
  unfollowById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        await prisma.applicationCollectionFollow.delete({
          where: {
            applicationCollectionId_userId: {
              applicationCollectionId: id,
              userId: session.user.id,
            },
          },
        });
        applicationCollectionEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  isOwnedById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .query(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        const exists = await prisma.applicationCollectionOwn.findFirst({
          where: {
            applicationCollectionId: id,
            userId: session.user.id,
          },
        });
        return Boolean(exists);
      } catch (err) {
        throw onError(err);
      }
    }),
  ownedList: protectedUserProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        return await prisma.applicationCollectionOwn.findMany({
          where: {
            userId: session.user.id,
          },
          select: {
            applicationCollectionId: true,
          },
        });
      } catch (err) {
        throw onError(err);
      }
    },
  ),
  ownById: protectedUserProcedure
    .input(idSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      try {
        // TODO: It should be checked if the user can pay for the application collection
        // await prisma.applicationCollection.update({
        //   where: { id },
        //   data: {
        //     Owners: {
        //       connect: {
        //         id: session.user.id,
        //       },
        //     },
        //   },
        // });
        // applicationCollectionEmitter.emit('update', id);
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
    .mutation(
      async ({
        ctx: { prisma },
        input: { id, name, description, price, applications },
      }) => {
        try {
          await prisma.$transaction(async (tx) => {
            const exists = await tx.applicationCollection.findFirst({
              where: {
                id,
              },
              select: defaultSelect,
            });
            if (!exists) throw new Error('Application collection not found');

            await tx.applicationCollection.update({
              where: {
                id,
              },
              data: {
                name,
                description,
                Applications: {
                  set: applications,
                },
              },
            });
            if (price) {
              for await (const next of price) {
                const created = exists.Price.find(
                  (price) => price.country === next.country,
                );
                if (!created) {
                  await tx.applicationCollection.update({
                    where: {
                      id,
                    },
                    data: {
                      Price: {
                        create: next,
                      },
                      PriceHistories: {
                        create: {
                          ...next,
                          startedAt: new Date(),
                        },
                      },
                    },
                  });
                } else {
                  if (
                    created.price === next.price &&
                    created.currency === next.currency
                  )
                    continue;

                  await tx.applicationCollection.update({
                    where: {
                      id,
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
                        create: {
                          ...next,
                          startedAt: new Date(),
                        },
                      },
                    },
                  });
                }
              }
            }
            applicationCollectionEmitter.emit('update', id);
          });
          return true;
        } catch (err) {
          throw onError(err);
        }
      },
    ),
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
