import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
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
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
