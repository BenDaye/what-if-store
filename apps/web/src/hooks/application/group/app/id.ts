import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { ApplicationGroupType } from '@what-if-store/prisma/client';
import type { RouterOutput } from '@what-if-store/server/react/trpc';
import { trpc } from '@what-if-store/server/react/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { applicationGroupCreateInputSchema, idSchema } from '@what-if-store/server/server/schemas';

export type AppApplicationGroupRouterOutput = RouterOutput['publicAppApplicationGroup']['getById'];
export const useAppApplicationGroupHookDataSchema = applicationGroupCreateInputSchema
  .omit({ applications: true })
  .extend({
    id: idSchema,

    applications: z.custom<AppApplicationGroupRouterOutput['Applications']>(),
    applicationIds: z.array(idSchema),
  })
  .strict();
export type UseAppApplicationGroupHookDataSchema = z.infer<typeof useAppApplicationGroupHookDataSchema>;

export const useAppApplicationGroup = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } = trpc.publicAppApplicationGroup.getById.useQuery(id, {
    enabled: !!id && id !== FallbackId,
  });
  trpc.publicAppApplicationGroup.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseAppApplicationGroupHookDataSchema => {
    return {
      id,
      name: data?.name ?? FallbackString,
      description: data?.description ?? FallbackString,
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
