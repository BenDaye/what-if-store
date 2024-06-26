import SuperJSON from 'superjson';
import { WebSocket } from 'ws';
import type { AppRouter } from '../server/routers/_app';
import type { CreateTRPCClient } from './index';
import { createTRPCClient, createWSClient, httpLink, splitLink, wsLink } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.WebSocket = WebSocket as any;

export const createBridgeTRPCClient = (port?: number): CreateTRPCClient<AppRouter> => {
  const _port = port ?? process.env.NEXT_PUBLIC_BRIDGE_PORT;
  if (!_port) {
    throw new Error('Bridge port is not provided');
  }
  const wsClient = createWSClient({
    url: `ws://localhost:${_port}`,
  });
  return createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition(op) {
          return op.type === 'subscription';
        },
        true: wsLink({
          client: wsClient,
          transformer: SuperJSON,
        }),
        false: httpLink({
          url: `http://localhost:${port}`,
          transformer: SuperJSON,
        }),
      }),
    ],
  });
};
