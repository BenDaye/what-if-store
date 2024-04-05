/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import { createContext } from '@/server/context';
import { AppRouter, appRouter } from '@/server/routers/_app';
import * as trpcNext from '@trpc/server/adapters/next';
import { nodeHTTPFormDataContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/form-data';
import { nodeHTTPJSONContentTypeHandler } from '@trpc/server/adapters/node-http/content-type/json';

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('🔴 Something went wrong', error);
    }
  },
  /**
   * Enable query batching
   */
  allowBatching: true,

  experimental_contentTypeHandlers: [
    nodeHTTPFormDataContentTypeHandler(),
    nodeHTTPJSONContentTypeHandler(),
  ],
});

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};
