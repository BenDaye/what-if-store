import { publicProcedure, router } from '../trpc';
import { applicationRouter } from './application';
import { systemInformationRouter } from './systeminformation';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => 'ok'),
  systemInformation: systemInformationRouter,
  application: applicationRouter,
});
export type AppRouter = typeof appRouter;
