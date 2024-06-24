import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import type { IdSchema } from '@/server/schemas';
import { applicationAssetCreateInputSchema, idSchema } from '@/server/schemas';
import type { PartialBlock } from '@blocknote/core';
import { ApplicationAssetType, AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import type { z } from 'zod';
import { trpc } from '@what-if-store/server/react/trpc';

// type DashboardApplicationAssetRouterOutput =
//   RouterOutput['protectedDashboardApplicationAsset']['getById'];
export const useDashboardApplicationAssetHookDataSchema = applicationAssetCreateInputSchema
  .extend({
    id: idSchema,
  })
  .strict();
export type UseDashboardApplicationAssetHookDataSchema = z.infer<
  typeof useDashboardApplicationAssetHookDataSchema
>;

export const useDashboardApplicationAsset = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplicationAsset.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId && authenticated,
    });
  trpc.protectedDashboardApplicationAsset.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const { showWarning } = useNotice();
  const { t } = useTranslation();
  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  const memoData = useMemo((): UseDashboardApplicationAssetHookDataSchema => {
    return {
      id,
      applicationId: data?.applicationId ?? FallbackId,
      type: data?.type ?? ApplicationAssetType.File,
      url: data?.url ?? '',
      name: data?.name ?? FallbackString,
      description: data?.description ?? FallbackString,
      content: data?.content as PartialBlock[] | undefined,
      isPrimary: data?.isPrimary ?? false,
      isLocal: data?.isLocal ?? false,
    };
  }, [id, data]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
