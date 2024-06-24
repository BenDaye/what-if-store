import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { ProviderType } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { idSchema, providerUpdateProfileInputSchema } from '@what-if-store/server/server/schemas';

// type DashboardProviderRouterOutput = RouterOutput['protectedDashboardProvider']['getById'];
export const useDashboardProviderHookDataSchema = providerUpdateProfileInputSchema
  .extend({
    id: idSchema,
    type: z.nativeEnum(ProviderType),
    avatarSrc: z.string().nullable().optional(),
    avatarText: z.string(),
    userId: z.string(),
    verified: z.boolean(),
  })
  .strict();
export type UseDashboardProviderHookDataSchema = z.infer<typeof useDashboardProviderHookDataSchema>;

export const useDashboardProvider = (id: IdSchema) => {
  const { data, isFetching, refetch, error, isError } = trpc.protectedDashboardProvider.getById.useQuery(id, {
    enabled: !!id && id !== FallbackId,
  });
  trpc.protectedDashboardProvider.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const { showWarning, showSuccess, showError } = useNotice();
  const { t } = useTranslation();
  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  const { mutateAsync: update } = trpc.protectedDashboardProvider.updateById.useMutation({
    onSuccess: () => {
      showSuccess(t('user:Profile.Updated'));
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  const memoData = useMemo(
    (): UseDashboardProviderHookDataSchema => ({
      id,
      name: data?.name ?? FallbackString,
      avatar: data?.avatar ?? FallbackString,
      email: data?.email ?? FallbackString,
      bio: data?.bio ?? FallbackString,
      type: data?.type ?? ProviderType.IndependentDeveloper,
      avatarSrc: data?.avatar,
      avatarText: data?.name?.charAt(0) ?? FallbackString,
      userId: data?.userId ?? FallbackId,
      verified: data?.verified ?? false,
    }),
    [data, id],
  );

  return {
    router: { data, refetch, isFetching, error, isError, update },
    data: memoData,
  };
};
