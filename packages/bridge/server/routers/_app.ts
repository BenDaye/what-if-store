import { publicProcedure, router } from '../trpc';
import { systemInformationRouter } from './systeminformation';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => 'ok'),
  systemInformation: systemInformationRouter,
});
export type AppRouter = typeof appRouter;
