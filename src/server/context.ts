import type {
  CreateNextContextOptions,
  NextApiRequest,
} from '@trpc/server/adapters/next';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { IncomingMessage } from 'node:http';
import { appLogger, prisma, redis } from './modules';

export interface CreateContextOptions {
  session: Session | null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions,
) => {
  const session = await getSession(opts);

  appLogger
    .child({}, { msgPrefix: '[TRPC] ' })
    .debug(session || 'Create Context For Guest', 'Create Context');

  return {
    session,
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
