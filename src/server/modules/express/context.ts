import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CreateContextOptions } from '../../context';
import { appLogger } from '../pino';
import { prisma } from '../prisma';
import { redis } from '../redis';

export const createContext = async ({ req }: CreateExpressContextOptions) => {
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
): Promise<CreateContextOptions['session']> => {
  const jwt = req.headers.authorization?.replace('Bearer ', '');
  if (!jwt) {
    return null;
  }
  // TODO: decode and verify JWT
  return null;
};
