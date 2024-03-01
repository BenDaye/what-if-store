/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import {
  publicAppAuth,
  protectedAppAuth,
  publicDashboardAuth,
  protectedDashboardAuth,
} from './auth';
import {
  protectedAppMeta,
  protectedDashboardMeta,
  publicAppMeta,
  publicDashboardMeta,
} from './meta';
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
});

export type AppRouter = typeof appRouter;
