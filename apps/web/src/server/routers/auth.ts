import { faker } from '@faker-js/faker';
import { TRPCError } from '@trpc/server';
import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { Session } from 'next-auth';
import { z } from 'zod';
import { env, userEmitter } from '../modules';
import { mutationOutputSchema, signUpSchema } from '../schemas';
import {
  protectedAdminProcedure,
  protectedUserProcedure,
  publicProcedure,
  router,
} from '../trpc';
import { onError } from '../utils/errors';

export const publicAppAuth = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .output(mutationOutputSchema)
    .mutation(async ({ ctx: { prisma }, input: { username, password } }) => {
      try {
        const isUser = await prisma.user.findFirst({
          where: { username },
        });
        if (isUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
          });
        }
        const { id } = await prisma.user.create({
          data: {
            username,
            password: await hash(password),
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
  signIn: publicProcedure
    .input(signUpSchema)
    .output(z.string())
    .mutation(async ({ ctx: { prisma }, input: { username, password } }) => {
      try {
        const user = await prisma.user.findFirst({
          where: { username },
          select: {
            id: true,
            password: true,
            role: true,
            username: true,
            UserProfile: {
              select: {
                nickname: true,
                email: true,
                avatar: true,
                bio: true,
                country: true,
              },
            },
          },
        });
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        const isValid = await verify(user.password, password);
        if (!isValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid account or password',
          });
        }
        const session: Session = {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            nickname: user.UserProfile?.nickname,
            email: user.UserProfile?.email,
            avatar: user.UserProfile?.avatar,
            bio: user.UserProfile?.bio,
            country: user.UserProfile?.country,
          },
          expires: `${Date.now() + 7 * 24 * 60 * 60 * 1000}`,
        };
        return sign(session, env.NEXTAUTH_SECRET, {
          expiresIn: 7 * 24 * 60 * 60,
        });
      } catch (error) {
        throw onError(error);
      }
    }),
  session: publicProcedure.query(async ({ ctx: { session } }) => session),
});

export const protectedAppAuth = router({});

export const publicDashboardAuth = router({
  session: publicProcedure.query(async ({ ctx: { session } }) => session),
});

export const protectedDashboardAuth = router({});
