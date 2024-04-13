import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  applicationTagCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

type AppApplicationTagRouterOutput =
  RouterOutput['publicAppApplicationTag']['getById'];
export const useAppApplicationTagHookDataSchema =
  applicationTagCreateInputSchema
    .extend({
      id: idSchema,
    })
    .strict();
export type UseAppApplicationTagHookDataSchema = z.infer<
  typeof useAppApplicationTagHookDataSchema
>;

export const useAppApplicationTag = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } =
    trpc.publicAppApplicationTag.getById.useQuery(id, {
      enabled: !!id,
    });
  trpc.publicAppApplicationTag.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  const memoData = useMemo((): UseAppApplicationTagHookDataSchema => {
    return {
      id,
      name: data?.name ?? '-',
    };
  }, [id, data]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
