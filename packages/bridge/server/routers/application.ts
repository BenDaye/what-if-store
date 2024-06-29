import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { getInstalledApps, installedAppsEmitter, setInstalledApps } from '../modules';
import { installedAppsInputSchema, type InstalledAppsInputSchema } from '../schema';
import { publicProcedure, router } from '../trpc';

export const applicationRouter = router({
  webSubscription: publicProcedure.subscription(() => {
    return observable<InstalledAppsInputSchema>((emit) => {
      const onUpdate = (apps: InstalledAppsInputSchema) => {
        try {
          emit.next(apps);
        } catch (error) {
          emit.error(error);
        }
      };
      installedAppsEmitter.on('update', onUpdate);
      return () => {
        installedAppsEmitter.off('update', onUpdate);
      };
    });
  }),
  electronSubscription: publicProcedure.subscription(() => {
    return observable<boolean>((emit) => {
      const onRefresh = (override: boolean) => {
        try {
          emit.next(override);
        } catch (error) {
          emit.error(error);
        }
      };
      installedAppsEmitter.on('refresh', onRefresh);
      return () => {
        installedAppsEmitter.off('refresh', onRefresh);
      };
    });
  }),
  refreshInstalledApps: publicProcedure.input(z.boolean()).mutation(async ({ input }) => {
    installedAppsEmitter.emit('refresh', input);
  }),
  getInstalledApps: publicProcedure.query(async () => getInstalledApps()),
  setInstalledApps: publicProcedure.input(installedAppsInputSchema).mutation(async ({ input }) => {
    setInstalledApps(input);
  }),
  clearInstalledApps: publicProcedure.mutation(async () => {
    setInstalledApps([]);
  }),
});
export type ApplicationRouter = typeof applicationRouter;
