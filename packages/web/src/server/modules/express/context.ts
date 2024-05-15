import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verify } from 'jsonwebtoken';
import { Session } from 'next-auth';
import { env } from '../env';
import { appLogger } from '../pino';
import { prisma } from '../prisma';
import { redis } from '../redis';

export const createContext = async ({ req }: CreateExpressContextOptions) => {
  appLogger.debug({ req: req.body });
  const session = await getSessionFromRequestHeaders(req);

  appLogger
    .child({}, { msgPrefix: '[tRPC] [Express] ' })
    .debug(session || 'Create Context For Guest', 'Create Context');

  return {
    session,
    prisma,
    redis,
    req,
  };
};

export type Context = Omit<Awaited<ReturnType<typeof createContext>>, 'req'> & {
  req?: CreateExpressContextOptions['req'];
};

const getSessionFromRequestHeaders = async (
  req: CreateExpressContextOptions['req'],
): Promise<Session | null> => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return verify(token, env.NEXTAUTH_SECRET) as Session;
  } catch (error) {
    appLogger.error({ error }, 'getSessionFromRequestHeaders');
    return null;
  }
};
