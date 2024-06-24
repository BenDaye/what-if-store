import type { IncomingMessage } from 'node:http';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import type { CreateNextContextOptions, NextApiRequest } from './adapters/next';
import type { CreateHTTPContextOptions } from './adapters/standalone';
import type { CreateWSSContextFnOptions } from './adapters/ws';
import { logger, prisma, redis } from './modules';

export interface CreateContextOptions {
  session: Session | null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions | CreateHTTPContextOptions,
): Promise<Context> => {
  const session = await getSession(opts);
  const sessionFromApiKey = await getSessionFromApiKey(opts);

  logger
    .child({}, { msgPrefix: '[tRPC] ' })
    .debug(session || sessionFromApiKey || 'Create Context For Guest', 'Create Context For User');

  return {
    session: session || sessionFromApiKey,
    prisma,
    redis,
    req: opts.req,
  };
};

export type Context = CreateContextOptions & {
  prisma: typeof prisma;
  redis: typeof redis;
  req?: NextApiRequest | IncomingMessage;
};

export const getSessionFromApiKey = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions | CreateHTTPContextOptions,
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
