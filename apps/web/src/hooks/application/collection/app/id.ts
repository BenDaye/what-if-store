import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
// import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import type { RouterOutput } from '@what-if-store/server/next/trpc';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { applicationCollectionCreateInputSchema, idSchema } from '@what-if-store/server/server/schemas';

type AppApplicationCollectionRouterOutput = RouterOutput['publicAppApplicationCollection']['getById'];
export const useAppApplicationCollectionHookDataSchema = applicationCollectionCreateInputSchema
  .omit({ applications: true })
  .extend({
    id: idSchema,
    // priceText: z.string(),

    applications: z.custom<AppApplicationCollectionRouterOutput['Applications']>(),
    applicationIds: z.array(idSchema),
  })
  .strict();
export type UseAppApplicationCollectionHookDataSchema = z.infer<
  typeof useAppApplicationCollectionHookDataSchema
>;

export const useAppApplicationCollection = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } = trpc.publicAppApplicationCollection.getById.useQuery(
    id,
    {
      enabled: !!id && id !== FallbackId,
    },
  );
  trpc.publicAppApplicationCollection.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseAppApplicationCollectionHookDataSchema => {
    return {
      id,
      name: data?.name ?? FallbackString,
      description: data?.description ?? FallbackString,
      price: data?.Price ?? [],
      // priceText: data?.price ? currency(data?.price).toString() : FallbackString,
      applications: data?.Applications ?? [],
      applicationIds: data?.Applications.map((app) => app.id) ?? [],
    };
  }, [id, data]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
