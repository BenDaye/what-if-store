import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import type { z } from 'zod';
import type { RouterOutput } from '@what-if-store/server/react/trpc';
import { trpc } from '@what-if-store/server/react/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { applicationTagCreateInputSchema, idSchema } from '@what-if-store/server/server/schemas';

type _AppApplicationTagRouterOutput = RouterOutput['publicAppApplicationTag']['getById'];
export const useAppApplicationTagHookDataSchema = applicationTagCreateInputSchema
  .extend({
    id: idSchema,
  })
  .strict();
export type UseAppApplicationTagHookDataSchema = z.infer<typeof useAppApplicationTagHookDataSchema>;

export const useAppApplicationTag = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } = trpc.publicAppApplicationTag.getById.useQuery(id, {
    enabled: !!id && id !== FallbackId,
  });
  trpc.publicAppApplicationTag.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseAppApplicationTagHookDataSchema => {
    return {
      id,
      name: data?.name ?? FallbackString,
    };
  }, [id, data]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
