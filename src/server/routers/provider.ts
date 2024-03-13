import { Prisma, ProviderVerificationStatus } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { providerEmitter, providerVerificationQueue } from '../modules';
import {
  IdSchema,
  idSchema,
  providerCreateProfileInputSchema,
  providerListInputSchema,
  providerUpdateProfileInputSchema,
  providerUpdateProfileInputSchemaForAdmin,
  providerVerificationRequestInputSchema,
  providerVerificationResponseInputSchema,
} from '../schemas';
import {
  protectedAdminProcedure,
  protectedProviderProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { formatListArgs, formatListResponse, onError } from '../utils';

const defaultSelect = Prisma.validator<Prisma.ProviderProfileSelect>()({
  id: true,
  userId: true,
  type: true,
  createdAt: true,
  updatedAt: true,
});

const fullSelect = {
  ...defaultSelect,
  ...Prisma.validator<Prisma.ProviderProfileSelect>()({
    name: true,
    verified: true,
    email: true,
    bio: true,
    website: true,
    avatar: true,
  }),
};

export const publicAppProvider = router({
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

      providerEmitter.on('create', onCreate);
      providerEmitter.on('update', onUpdate);
      providerEmitter.on('remove', onRemove);
      return () => {
        providerEmitter.off('create', onCreate);
        providerEmitter.off('update', onUpdate);
        providerEmitter.off('remove', onRemove);
      };
    });
  }),
  list: publicProcedure
    .input(providerListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ProviderProfileWhereInput = {
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
            prisma.providerProfile.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.providerProfile.count({ where }),
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
        return await prisma.providerProfile.findUniqueOrThrow({
          where: { id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const protectedAppProvider = router({
  get: protectedProviderProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        return await prisma.providerProfile.findUniqueOrThrow({
          where: { userId: session.user.id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    },
  ),
  update: protectedProviderProcedure
    .input(providerUpdateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        await prisma.providerProfile.update({
          where: { userId: session.user.id },
          data: {
            name: input.name,
            email: input.email,
            bio: input.bio,
            website: input.website,
            avatar: input.avatar,
          },
        });
        providerEmitter.emit('update', session.user.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  create: protectedUserProcedure
    .input(providerCreateProfileInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        const isProvider = await prisma.providerProfile.findFirst({
          where: {
            userId: session.user.id,
          },
        });
        if (isProvider) throw new Error('Provider already exists');

        const provider = await prisma.providerProfile.create({
          data: {
            name: input.name,
            type: input.type,
            userId: session.user.id,
            email: input.email,
            bio: input.bio,
            website: input.website,
            avatar: input.avatar,
          },
        });
        providerEmitter.emit('create', provider.id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  applyVerification: protectedProviderProcedure
    .input(providerVerificationRequestInputSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        const provider = await prisma.providerProfile.findUnique({
          where: { userId: session.user.id },
          select: {
            id: true,
            verified: true,
            Verifications: true,
          },
        });

        if (!provider) throw new Error('Provider not found');
        if (provider.verified) throw new Error('Provider already verified');

        const hasPendingOrApprovedVerification = provider.Verifications.some(
          (v) =>
            v.status === ProviderVerificationStatus.Pending ||
            v.status === ProviderVerificationStatus.Approved,
        );
        if (hasPendingOrApprovedVerification)
          throw new Error('Verification already pending or approved');

        const job = await providerVerificationQueue.add(provider.id, {
          application: input.application,
        });

        return job.id;
      } catch (err) {
        throw onError(err);
      }
    }),
});

export const publicDashboardProvider = router({});

export const protectedDashboardProvider = router({
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

      providerEmitter.on('create', onCreate);
      providerEmitter.on('update', onUpdate);
      providerEmitter.on('remove', onRemove);
      return () => {
        providerEmitter.off('create', onCreate);
        providerEmitter.off('update', onUpdate);
        providerEmitter.off('remove', onRemove);
      };
    });
  }),
  list: protectedAdminProcedure
    .input(providerListInputSchema)
    .query(
      async ({
        ctx: { prisma },
        input: { limit, skip, cursor, query, ...rest },
      }) => {
        try {
          const where: Prisma.ProviderProfileWhereInput = {
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
            prisma.providerProfile.findMany({
              where,
              ...formatListArgs(limit, skip, cursor),
              orderBy: [
                {
                  createdAt: 'asc',
                },
              ],
              select: defaultSelect,
            }),
            prisma.providerProfile.count({ where }),
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
        return await prisma.providerProfile.findUniqueOrThrow({
          where: { id },
          select: fullSelect,
        });
      } catch (err) {
        throw onError(err);
      }
    }),
  updateById: protectedAdminProcedure
    .input(providerUpdateProfileInputSchemaForAdmin)
    .mutation(async ({ ctx: { prisma }, input: { id, ...input } }) => {
      try {
        await prisma.providerProfile.update({
          where: { id },
          data: {
            name: input.name,
            type: input.type,
            email: input.email,
            bio: input.bio,
            website: input.website,
            avatar: input.avatar,
          },
        });
        providerEmitter.emit('update', id);
        return true;
      } catch (err) {
        throw onError(err);
      }
    }),
  replyVerification: protectedAdminProcedure
    .input(providerVerificationResponseInputSchema)
    .mutation(
      async ({ ctx: { prisma }, input: { id, status, replication } }) => {
        try {
          const verification = await prisma.providerVerification.findUnique({
            where: { id: id },
            select: {
              status: true,
              providerId: true,
            },
          });

          if (!verification) throw new Error('Verification not found');
          if (verification.status !== ProviderVerificationStatus.Pending)
            throw new Error('Verification not pending');

          await prisma.$transaction([
            prisma.providerVerification.update({
              where: { id },
              data: {
                status,
                replication,
              },
            }),
            prisma.providerProfile.update({
              where: { id: verification.providerId },
              data: {
                verified: status === ProviderVerificationStatus.Approved,
              },
            }),
          ]);
          return true;
        } catch (err) {
          throw onError(err);
        }
      },
    ),
});
