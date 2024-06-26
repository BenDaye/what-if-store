import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { ApplicationGroupType, AuthRole } from '@what-if-store/prisma/client';
import type { RouterOutput } from '@what-if-store/server/next/trpc';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { applicationGroupCreateInputSchema, idSchema } from '@what-if-store/server/server/schemas';

export type DashboardApplicationGroupRouterOutput =
  RouterOutput['protectedDashboardApplicationGroup']['getById'];
export const useDashboardApplicationGroupHookDataSchema = applicationGroupCreateInputSchema
  .omit({ applications: true })
  .extend({
    id: idSchema,

    applications: z.custom<DashboardApplicationGroupRouterOutput['Applications']>(),
    applicationIds: z.array(idSchema),
  })
  .strict();
export type UseDashboardApplicationGroupHookDataSchema = z.infer<
  typeof useDashboardApplicationGroupHookDataSchema
>;

export const useDashboardApplicationGroup = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplicationGroup.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId && authenticated,
    });
  trpc.protectedDashboardApplicationGroup.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseDashboardApplicationGroupHookDataSchema => {
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
