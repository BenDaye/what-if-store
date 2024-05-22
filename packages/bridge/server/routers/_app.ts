import { router } from '../trpc';
import { systemInformationRouter } from './systeminformation';

export const appRouter = router({
  systemInformation: systemInformationRouter,
});
export type AppRouter = typeof appRouter;
