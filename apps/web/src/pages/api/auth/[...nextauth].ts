import { verify } from 'argon2';
import type { AuthOptions, User } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { Prisma } from '@what-if-store/prisma/client';
import { prisma } from '@what-if-store/server/server/modules/prisma';
import { signInSchema } from '@what-if-store/server/server/schemas/auth';

const select = Prisma.validator<Prisma.UserSelect>()({
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
});

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.nickname = user.nickname;
        token.email = user.email;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.country = user.country;
      }

      if (trigger === 'update') {
        if (typeof session !== 'undefined') {
          const valid = await z
            .object({
              nickname: z.string().nullable().optional(),
              email: z.string().email().nullable().optional(),
              avatar: z.string().nullable().optional(),
              bio: z.string().nullable().optional(),
              country: z.string().nullable().optional(),
            })
            .strict()
            .safeParseAsync(session);
          if (valid.success) {
            if (valid.data?.nickname) token.nickname = valid.data.nickname;
            if (valid.data?.email) token.email = valid.data.email;
            if (valid.data?.avatar) token.avatar = valid.data.avatar;
            if (valid.data?.bio) token.bio = valid.data.bio;
            if (valid.data?.country) token.country = valid.data.country;
          }
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          role: token.role,
          nickname: token.nickname,
          email: token.email,
          avatar: token.avatar,
          bio: token.bio,
        };
      }

      return session;
    },
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/app',
    error: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const valid = await signInSchema.spa(credentials);
          if (!valid.success) throw new Error(valid.error.message);
          const { username, password } = valid.data;

          const result = await prisma.user.findFirst({
            where: {
              username,
            },
            select,
          });

          if (!result) throw new Error('Account not found or password incorrect');
          if (!(await verify(result.password, password)))
            throw new Error('Account not found or password incorrect');

          return {
            id: result.id,
            username: result.username,
            role: result.role,
            nickname: result.UserProfile?.nickname,
            email: result.UserProfile?.email,
            avatar: result.UserProfile?.avatar,
            bio: result.UserProfile?.bio,
            country: result.UserProfile?.country,
          };
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            // NOTE: We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
            throw new Error('CredentialsSignin');
          }
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
