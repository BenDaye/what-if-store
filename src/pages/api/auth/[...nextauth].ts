import { prisma } from '@/server/modules/prisma';
import { signInSchema } from '@/server/schemas/auth';
import { Prisma } from '@prisma/client';
import { verify } from 'argon2';
import { AuthOptions, User } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  password: true,
  role: true,
  username: true,
  UserProfile: {
    select: {
      nickname: true,
      email: true,
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
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === 'update') {
        if (session?.name) token.name = session.name;
        if (session?.email) token.email = session.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          role: token.role,
          name: token.name,
          email: token.email,
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

          if (!result)
            throw new Error('Account not found or password incorrect');
          if (!(await verify(result.password, password)))
            throw new Error('Account not found or password incorrect');

          return {
            id: result.id,
            username: result.username,
            role: result.role,
            name: result.UserProfile?.nickname,
            email: result.UserProfile?.email,
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
