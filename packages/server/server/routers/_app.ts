/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import {
  protectedAppApplication,
  protectedDashboardApplication,
  publicAppApplication,
  publicDashboardApplication,
} from './application';
import {
  protectedAppApplicationAsset,
  protectedDashboardApplicationAsset,
  publicAppApplicationAsset,
  publicDashboardApplicationAsset,
} from './application_asset';
import {
  protectedAppApplicationCollection,
  protectedDashboardApplicationCollection,
  publicAppApplicationCollection,
  publicDashboardApplicationCollection,
} from './application_collection';
import {
  protectedAppApplicationGroup,
  protectedDashboardApplicationGroup,
  publicAppApplicationGroup,
  publicDashboardApplicationGroup,
} from './application_group';
import {
  protectedAppApplicationTag,
  protectedDashboardApplicationTag,
  publicAppApplicationTag,
  publicDashboardApplicationTag,
} from './application_tag';
import {
  protectedAppApplicationVersion,
  protectedDashboardApplicationVersion,
  publicAppApplicationVersion,
  publicDashboardApplicationVersion,
} from './application_version';
import { protectedAppAuth, protectedDashboardAuth, publicAppAuth, publicDashboardAuth } from './auth';
import { protectedAppMeta, protectedDashboardMeta, publicAppMeta, publicDashboardMeta } from './meta';
import {
  protectedAppProvider,
  protectedDashboardProvider,
  publicAppProvider,
  publicDashboardProvider,
} from './provider';
import {
  protectedAppUpload,
  protectedDashboardUpload,
  publicAppUpload,
  publicDashboardUpload,
} from './upload';
import { protectedAppUser, protectedDashboardUser, publicAppUser, publicDashboardUser } from './user';
import {
  protectedAppUserApiKey,
  protectedDashboardUserApiKey,
  publicAppUserApiKey,
  publicDashboardUserApiKey,
} from './user_key';

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => 'ok'),
  app: router({
    public: router({
      meta: publicAppMeta,
      auth: publicAppAuth,
      user: publicAppUser,
    }),
  }),
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
  // NOTE: ApplicationGroup
  protectedAppApplicationGroup,
  protectedDashboardApplicationGroup,
  publicAppApplicationGroup,
  publicDashboardApplicationGroup,
  // NOTE: ApplicationCollection
  protectedAppApplicationCollection,
  protectedDashboardApplicationCollection,
  publicAppApplicationCollection,
  publicDashboardApplicationCollection,
  // NOTE: ApplicationTag
  protectedAppApplicationTag,
  protectedDashboardApplicationTag,
  publicAppApplicationTag,
  publicDashboardApplicationTag,
  // NOTE: ApplicationVersion
  protectedAppApplicationVersion,
  protectedDashboardApplicationVersion,
  publicAppApplicationVersion,
  publicDashboardApplicationVersion,
  // NOTE: ApplicationAsset
  protectedAppApplicationAsset,
  protectedDashboardApplicationAsset,
  publicAppApplicationAsset,
  publicDashboardApplicationAsset,
  // NOTE: Upload
  protectedAppUpload,
  protectedDashboardUpload,
  publicAppUpload,
  publicDashboardUpload,
  // NOTE: UserApiKey
  protectedAppUserApiKey,
  protectedDashboardUserApiKey,
  publicAppUserApiKey,
  publicDashboardUserApiKey,
});

export type AppRouter = typeof appRouter;

export const appRouterWithTRPC = router({
  trpc: appRouter,
});
export type AppRouterWithTRPC = typeof appRouterWithTRPC;
