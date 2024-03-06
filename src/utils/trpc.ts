import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { createTRPCNext } from '@trpc/next';
import { NextPageContext } from 'next';
import superjson from 'superjson';

// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type { AppRouter } from '@/server/routers/_app';
import { TRPCLink } from '@trpc/client';
import type { inferRouterOutputs } from '@trpc/server';

let client: ReturnType<typeof createWSClient> | null = null;

function getEndingLink(ctx: NextPageContext | undefined): TRPCLink<AppRouter> {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          'x-ssr': '1',
        };
      },
      transformer: superjson,
    });
  }
  client = createWSClient({
    url: `${process.env.NEXT_PUBLIC_WS_URL}`,
    lazy: {
      enabled: true,
      closeMs: 30 * 1000,
    },
  });
  return wsLink<AppRouter>({
    client,
    transformer: superjson,
  });
}

export const resetTRPCClient = () => {
  if (client) {
    client.close();
  }
  client = createWSClient({
    url: `${process.env.NEXT_PUBLIC_WS_URL}`,
    lazy: {
      enabled: true,
      closeMs: 30 * 1000,
    },
  });
};

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/client/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        getEndingLink(ctx),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: 2 * 1000, refetchOnWindowFocus: false },
        },
      },
      abortOnUnmount: true,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
  transformer: superjson,
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
