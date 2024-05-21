import type { IncomingMessage } from 'node:http';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import type { CreateNextContextOptions, NextApiRequest } from '@trpc/server/adapters/next';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import type { appLogger, prisma, redis } from './modules';

export interface CreateContextOptions {
  session: Session | null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (opts: CreateNextContextOptions | CreateWSSContextFnOptions) => {
  const session = await getSession(opts);
  const sessionFromApiKey = await getSessionFromApiKey(opts);

  appLogger
    .child({}, { msgPrefix: '[tRPC] ' })
    .debug(session || sessionFromApiKey || 'Create Context For Guest', 'Create Context For User');

  return {
    session: session || sessionFromApiKey,
    prisma,
    redis,
    req: opts.req,
  };
};

export type Context = Omit<Awaited<ReturnType<typeof createContext>>, 'req'> & {
  req?: NextApiRequest | IncomingMessage;
};

// export type Context = CreateContextOptions & {
//   prisma: PrismaClient;
//   redis: Redis;
// };
export const getSessionFromApiKey = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions,
): Promise<CreateContextOptions['session']> => {
  const apiKey = opts.req.headers['x-api-key'];
  if (!apiKey) {
    return null;
  }
  const key = Array.isArray(apiKey) ? apiKey[0] : apiKey;
  const user = await prisma.userApiKey.findUnique({
    where: { key },
    select: {
      User: {
        select: {
          id: true,
          username: true,
          role: true,
          UserProfile: {
            select: {
              nickname: true,
              avatar: true,
              bio: true,
              email: true,
            },
          },
        },
      },
    },
  });
  if (!user) return null;
  return {
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    user: {
      id: user.User.id,
      role: user.User.role,
      username: user.User.username,
      nickname: user.User.UserProfile?.nickname,
      avatar: user.User.UserProfile?.avatar,
      bio: user.User.UserProfile?.bio,
      email: user.User.UserProfile?.email,
      name: undefined,
      image: undefined,
    },
  };
};
