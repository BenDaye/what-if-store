import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import React, { useState } from 'react';
import SuperJSON from 'superjson';
import { httpBatchLink } from './index';
import { trpc } from './trpc';

export const TRPCProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          transformer: SuperJSON,
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
