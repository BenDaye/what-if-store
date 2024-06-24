import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import type { IdSchema } from '@/server/schemas';
import { applicationTagCreateInputSchema, idSchema } from '@/server/schemas';
import type { RouterOutput } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import type { z } from 'zod';
import { trpc } from '@what-if-store/server/react/trpc';

type _DashboardApplicationTagRouterOutput = RouterOutput['protectedDashboardApplicationTag']['getById'];
export const useDashboardApplicationTagHookDataSchema = applicationTagCreateInputSchema
  .extend({
    id: idSchema,
  })
  .strict();
export type UseDashboardApplicationTagHookDataSchema = z.infer<
  typeof useDashboardApplicationTagHookDataSchema
>;

export const useDashboardApplicationTag = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplicationTag.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId && authenticated,
    });
  trpc.protectedDashboardApplicationTag.subscribe.useSubscription(undefined, {
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

  const memoData = useMemo((): UseDashboardApplicationTagHookDataSchema => {
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
