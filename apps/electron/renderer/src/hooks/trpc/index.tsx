import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import SuperJSON from 'superjson';
import type { AppRouter } from '@what-if-store/web/src/server/routers/_app';
import { createTRPCReact, httpLink } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export interface TRPCProviderProps extends PropsWithChildren {
  apiKey?: string | null;
  baseUrl?: string;
  basePath?: string;
}

export type TRPCContextValue = {
  apiKey?: string | null;
};

export const TRPCContext = createContext<TRPCContextValue | undefined>(undefined);

export const TRPCProvider = ({
  children,
  apiKey,
  baseUrl = 'http://localhost:3200',
  basePath = '/api/trpc',
}: TRPCProviderProps) => {
  if (!TRPCContext) throw new Error('TRPCProvider must be used within a TRPCContext.Provider');

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${baseUrl}${basePath}`,
          methodOverride: 'POST',
          headers: () => {
            return apiKey
              ? {
                  'x-api-key': apiKey,
                }
              : {};
          },
          fetch: (url, options) => fetch(url, { ...options, credentials: 'include' }),
          transformer: SuperJSON,
        }),
      ],
    }),
  );

  return (
    <TRPCContext.Provider value={{ apiKey }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    </TRPCContext.Provider>
  );
};
