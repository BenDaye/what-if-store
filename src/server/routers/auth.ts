import { faker } from '@faker-js/faker';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { userEmitter } from '../modules';
import { mutationOutputSchema, signUpSchema } from '../schemas';
import { publicProcedure, router } from '../trpc';
import { onError } from '../utils/errors';

export const publicAppAuth = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const isUser = await prisma.user.findFirst({
          where: { username: input.username },
        });
        if (isUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
          });
        }
        const { id } = await prisma.user.create({
          data: {
            username: input.username,
            password: await hash(input.password),
            UserProfile: {
              create: {
                nickname: faker.internet.userName(),
                bio: faker.person.bio(),
                avatar: faker.image.avatar(),
              },
            },
          },
          select: {
            id: true,
          },
        });
        userEmitter.emit('create', id);
        return true;
      } catch (error) {
        throw onError(error);
      }
    }),
});

export const protectedAppAuth = router({});

export const publicDashboardAuth = router({});

export const protectedDashboardAuth = router({});
