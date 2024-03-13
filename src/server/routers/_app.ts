/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import {
  protectedAppApplication,
  protectedDashboardApplication,
  publicAppApplication,
  publicDashboardApplication,
} from './application';
import {
  protectedAppAuth,
  protectedDashboardAuth,
  publicAppAuth,
  publicDashboardAuth,
} from './auth';
import {
  protectedAppMeta,
  protectedDashboardMeta,
  publicAppMeta,
  publicDashboardMeta,
} from './meta';
import {
  protectedAppProvider,
  protectedDashboardProvider,
  publicAppProvider,
  publicDashboardProvider,
} from './provider';
import {
  protectedAppUser,
  protectedDashboardUser,
  publicAppUser,
  publicDashboardUser,
} from './user';

export const appRouter = router({
  // NOTE: Meta
  protectedAppMeta,
  protectedDashboardMeta,
  publicAppMeta,
  publicDashboardMeta,
  // NOTE: Auth
  publicAppAuth,
  protectedAppAuth,
  publicDashboardAuth,
  protectedDashboardAuth,
  // NOTE: User
  protectedAppUser,
  protectedDashboardUser,
  publicAppUser,
  publicDashboardUser,
  // NOTE: Provider
  protectedAppProvider,
  protectedDashboardProvider,
  publicAppProvider,
  publicDashboardProvider,
  // NOTE: Application
  protectedAppApplication,
  protectedDashboardApplication,
  publicAppApplication,
  publicDashboardApplication,
});

export type AppRouter = typeof appRouter;
