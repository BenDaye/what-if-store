import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';
import SuperJSON from 'superjson';
import { env } from '../server/modules/env';
import { createWSClient, httpBatchLink, splitLink, wsLink } from './index';
import { trpc } from './trpc';

export const TRPCProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({
            client: createWSClient({
              url: env.NEXT_PUBLIC_SERVER_WS_URL,
            }),
            transformer: SuperJSON,
          }),
          false: httpBatchLink({
            url: env.NEXT_PUBLIC_SERVER_HTTP_URL,
            transformer: SuperJSON,
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
