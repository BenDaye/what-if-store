import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import type { PartialBlock } from '@blocknote/core';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import type { z } from 'zod';
import { ApplicationAssetType } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { applicationAssetCreateInputSchema, idSchema } from '@what-if-store/server/server/schemas';

// type AppApplicationAssetRouterOutput =
//   RouterOutput['publicAppApplicationAsset']['getById'];
export const useAppApplicationAssetHookDataSchema = applicationAssetCreateInputSchema
  .extend({
    id: idSchema,
  })
  .strict();
export type UseAppApplicationAssetHookDataSchema = z.infer<typeof useAppApplicationAssetHookDataSchema>;

export const useAppApplicationAsset = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } = trpc.publicAppApplicationAsset.getById.useQuery(id, {
    enabled: !!id && id !== FallbackId,
  });
  trpc.publicAppApplicationAsset.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const memoData = useMemo((): UseAppApplicationAssetHookDataSchema => {
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

  const { showWarning } = useNotice();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
