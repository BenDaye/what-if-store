import SuperJSON from 'superjson';
import { WebSocket } from 'ws';
import { createTRPCClient, createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';
import type { StartTRPCServerProps } from '../server/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.WebSocket = WebSocket as any;

export const createBridgeTRPCClient = (
  props?: StartTRPCServerProps,
): ReturnType<typeof createTRPCClient<AppRouter>> => {
  const port = props?.port ?? process.env.NEXT_PUBLIC_BRIDGE_PORT;
  const wsClient = createWSClient({
    url: `ws://localhost:${port}`,
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
