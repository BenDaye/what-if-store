import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { onError } from '../utils/errors';
import { userEmitter } from '../modules';
import { signUpSchema } from '../schemas/auth';
import { idSchema } from '../schemas/id';
import { publicProcedure, router } from '../trpc';

export const publicAppAuth = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .output(idSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const id = await prisma.$transaction(async (tx) => {
          const exist = await tx.user.findUnique({
            where: { username: input.username },
          });
          if (exist)
            throw new TRPCError({
              code: 'CONFLICT',
              message: `Username [${input.username}] already exists`,
            });
          const user = await tx.user.create({
            data: {
              username: input.username,
              password: await hash(input.password),
              UserProfile: {
                create: {},
              },
            },
          });

          await tx.userProfile.update({
            where: {
              userId: user.id,
            },
            data: {
              nickname: `User#${user.id}`,
            },
          });

          return user.id;
        });

        userEmitter.emit('create', id);
        return id;
      } catch (error) {
        throw onError(error);
      }
    }),
});

export const protectedAppAuth = router({});

export const publicDashboardAuth = router({});

export const protectedDashboardAuth = router({});
