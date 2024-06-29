import SuperJSON from 'superjson';
import { WebSocket } from 'ws';
import type { AppRouter } from '../server/routers/_app';
import type { CreateTRPCClient } from './index';
import { createTRPCClient, createWSClient, httpBatchLink, splitLink, wsLink } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.WebSocket = WebSocket as any;

export const createServerTRPCClient = (port?: number): CreateTRPCClient<AppRouter> => {
  const _port = port ?? Number(process.env.NEXT_PUBLIC_SERVER_PORT);
  if (!_port || Number.isNaN(_port)) {
    throw new Error('Server port is not provided');
  }
  return createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition() {
          return typeof window === 'undefined';
        },
        true: httpBatchLink({
          url: `http://localhost:${_port}`,
          transformer: SuperJSON,
        }),
        false: splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: wsLink({
            client: createWSClient({
              url: `ws://localhost:${_port}`,
            }),
            transformer: SuperJSON,
          }),
          false: httpBatchLink({
            url: `http://localhost:${_port}`,
            transformer: SuperJSON,
          }),
        }),
      }),
    ],
  });
};
