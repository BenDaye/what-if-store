import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';
import SuperJSON from 'superjson';
import { createWSClient, httpBatchLink, splitLink, wsLink } from './index';
import { trpc } from './trpc';

type TrpcProviderProps = PropsWithChildren & {
  httpServerUrl?: string;
  wsServerUrl?: string;
};

export const TrpcProvider = ({
  httpServerUrl = process.env.NEXT_PUBLIC_BRIDGE_HTTP_URL,
  wsServerUrl = process.env.NEXT_PUBLIC_BRIDGE_WS_URL,
  children,
}: TrpcProviderProps) => {
  if (!httpServerUrl || !wsServerUrl) {
    throw new Error('Missing server url');
  }
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition() {
            return typeof window === 'undefined';
          },
          true: httpBatchLink({
            url: httpServerUrl,
            transformer: SuperJSON,
          }),
          false: splitLink({
            condition: (op) => op.type === 'subscription',
            true: wsLink({
              client: createWSClient({
                url: wsServerUrl,
              }),
              transformer: SuperJSON,
            }),
            false: httpBatchLink({
              url: httpServerUrl,
              transformer: SuperJSON,
            }),
          }),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export const BridgeTrpcProvider = TrpcProvider;
