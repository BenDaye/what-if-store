/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import { createContext } from '@/server/context';
import type { AppRouter } from '@/server/routers/_app';
import { appRouter } from '@/server/routers/_app';
import type { NextApiRequest, NextApiResponse } from '@trpc/server/adapters/next';
import { createNextApiHandler } from '@trpc/server/adapters/next';

const nextApiHandler = createNextApiHandler<AppRouter>({
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
  allowMethodOverride: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // We can use the response object to enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // If you need to make authenticated CORS calls then
  // remove what is above and uncomment the below code
  // Allow-Origin has to be set to the requesting domain that you want to send the credentials back to
  // res.setHeader('Access-Control-Allow-Origin', 'http://example:6006');
  // res.setHeader('Access-Control-Request-Method', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  // res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Referrer-Policy', 'no-referrer');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }
  // finally pass the request on to the tRPC handler
  return nextApiHandler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};
