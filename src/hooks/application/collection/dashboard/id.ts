import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  applicationCollectionCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
// import currency from 'currency.js';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

type DashboardApplicationCollectionRouterOutput =
  RouterOutput['protectedDashboardApplicationCollection']['getById'];
export const useDashboardApplicationCollectionHookDataSchema =
  applicationCollectionCreateInputSchema
    .omit({ applications: true })
    .extend({
      id: idSchema,
      // priceText: z.string(),

      applications:
        z.custom<DashboardApplicationCollectionRouterOutput['Applications']>(),
      applicationIds: z.array(idSchema),
    })
    .strict();
export type UseDashboardApplicationCollectionHookDataSchema = z.infer<
  typeof useDashboardApplicationCollectionHookDataSchema
>;

export const useDashboardApplicationCollection = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplicationCollection.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId && authenticated,
    });
  trpc.protectedDashboardApplicationCollection.subscribe.useSubscription(
    undefined,
    {
      enabled: authenticated,
      onData: (_id) => {
        if (_id === id) refetch();
      },
    },
  );

  const { showWarning } = useNotice();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  const memoData =
    useMemo((): UseDashboardApplicationCollectionHookDataSchema => {
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
