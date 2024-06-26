import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const createContext = async (opts?: CreateHTTPContextOptions | CreateWSSContextFnOptions) => {
  const apiKey = opts?.req.headers['x-api-key'];

  return {
    apiKey: Array.isArray(apiKey) ? apiKey[0] : typeof apiKey === 'string' ? apiKey : undefined,
    req: opts?.req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const createExpressContext = async (opts?: CreateExpressContextOptions) => {
  const apiKey = opts?.req.headers['x-api-key'];

  return {
    apiKey: Array.isArray(apiKey) ? apiKey[0] : typeof apiKey === 'string' ? apiKey : undefined,
    req: opts?.req,
  };
};
export type ExpressContext = Awaited<ReturnType<typeof createExpressContext>>;
