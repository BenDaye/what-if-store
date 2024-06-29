import { publicProcedure, router } from '../trpc';
import { systemInformationRouter } from './systeminformation';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => 'ok'),
  systemInformation: systemInformationRouter,
});
export type AppRouter = typeof appRouter;

export const appRouterWithTRPC = router({
  trpc: appRouter,
});
export type AppRouterWithTRPC = typeof appRouterWithTRPC;
