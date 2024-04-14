import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  applicationGroupCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { ApplicationGroupType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

type AppApplicationGroupRouterOutput =
  RouterOutput['publicAppApplicationGroup']['getById'];
export const useAppApplicationGroupHookDataSchema =
  applicationGroupCreateInputSchema
    .omit({ applications: true })
    .extend({
      id: idSchema,

      applications: z.custom<AppApplicationGroupRouterOutput['Applications']>(),
      applicationIds: z.array(idSchema),
    })
    .strict();
export type UseAppApplicationGroupHookDataSchema = z.infer<
  typeof useAppApplicationGroupHookDataSchema
>;

export const useAppApplicationGroup = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } =
    trpc.publicAppApplicationGroup.getById.useQuery(id, {
      enabled: !!id,
    });
  trpc.publicAppApplicationGroup.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseAppApplicationGroupHookDataSchema => {
    return {
      id,
      name: data?.name ?? '-',
      description: data?.description ?? '-',
      type: data?.type ?? ApplicationGroupType.Temporary,
      priority: data?.priority ?? Number.MIN_VALUE,
      applications: data?.Applications ?? [],
      applicationIds: data?.Applications.map((app) => app.id) ?? [],
    };
  }, [id, data]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};