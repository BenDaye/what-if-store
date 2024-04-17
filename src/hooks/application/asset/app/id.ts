import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  applicationAssetCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { PartialBlock } from '@blocknote/core';
import { ApplicationAssetType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

// type AppApplicationAssetRouterOutput =
//   RouterOutput['publicAppApplicationAsset']['getById'];
export const useAppApplicationAssetHookDataSchema =
  applicationAssetCreateInputSchema
    .extend({
      id: idSchema,
    })
    .strict();
export type UseAppApplicationAssetHookDataSchema = z.infer<
  typeof useAppApplicationAssetHookDataSchema
>;

export const useAppApplicationAsset = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } =
    trpc.publicAppApplicationAsset.getById.useQuery(id, {
      enabled: !!id,
    });
  trpc.publicAppApplicationAsset.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const memoData = useMemo((): UseAppApplicationAssetHookDataSchema => {
    return {
      id,
      applicationId: data?.applicationId ?? '',
      type: data?.type ?? ApplicationAssetType.File,
      url: data?.url ?? '',
      name: data?.name ?? '-',
      description: data?.description ?? '-',
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
