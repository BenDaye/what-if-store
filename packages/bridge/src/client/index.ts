import {
  createTRPCClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import SuperJSON from 'superjson';
import { WebSocket } from 'ws';
import type { AppRouter } from '../server/routers/_app';
import { StartTRPCServerProps } from '../server/schema';

globalThis.WebSocket = WebSocket as any;

export const createBridgeTRPCClient = (
  props?: StartTRPCServerProps,
): ReturnType<typeof createTRPCClient<AppRouter>> => {
  const wsClient = createWSClient({
    url: `ws://localhost:${props?.port ?? 3232}`,
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
          url: `http://localhost:${props?.port ?? 3232}`,
          transformer: SuperJSON,
        }),
      }),
    ],
  });
};
