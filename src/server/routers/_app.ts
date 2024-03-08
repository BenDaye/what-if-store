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
  protectedAppAuthor,
  protectedDashboardAuthor,
  publicAppAuthor,
  publicDashboardAuthor,
} from './author';
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
  // NOTE: Author
  protectedAppAuthor,
  protectedDashboardAuthor,
  publicAppAuthor,
  publicDashboardAuthor,
  // NOTE: Application
  protectedAppApplication,
  protectedDashboardApplication,
  publicAppApplication,
  publicDashboardApplication,
});

export type AppRouter = typeof appRouter;
