import {
  IdSchema,
  applicationAssetCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { PartialBlock } from '@blocknote/core';
import { ApplicationAssetType, AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useNotice } from '../notice';

type DashboardApplicationAssetRouterOutput =
  RouterOutput['protectedDashboardApplicationAsset']['getById'];
export const useDashboardApplicationAssetHookDataSchema =
  applicationAssetCreateInputSchema
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
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardApplicationAsset.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const memoData = useMemo((): UseDashboardApplicationAssetHookDataSchema => {
    return {
      id,
      applicationId: data?.applicationId ?? '',
      type: data?.type ?? ApplicationAssetType.File,
      url: data?.url ?? '',
      name: data?.name ?? '-',
      description: data?.description ?? '-',
      content: (data?.content as PartialBlock[]) ?? [],
      isPrimary: data?.isPrimary ?? false,
      isLocal: data?.isLocal ?? false,
    };
  }, [id, data]);

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
