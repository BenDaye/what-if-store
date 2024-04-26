import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  idSchema,
  userUpdateProfileInputSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

type DashboardUserRouterOutput =
  RouterOutput['protectedDashboardUser']['getById'];
export const useDashboardUserHookDataSchema = userUpdateProfileInputSchema
  .extend({
    id: idSchema,
    username: z.string(),
    role: z.nativeEnum(AuthRole),
    avatarSrc: z.string().nullable().optional(),
    avatarText: z.string(),
    provider: z
      .custom<DashboardUserRouterOutput['ProviderProfile']>()
      .optional(),
    providerId: z.string().optional(),
    providerName: z.string().optional(),
  })
  .strict();
export type UseDashboardUserHookDataSchema = z.infer<
  typeof useDashboardUserHookDataSchema
>;

export const useDashboardUser = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardUser.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId && authenticated,
    });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
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

  const { mutateAsync: update } =
    trpc.protectedDashboardUser.updateById.useMutation({
      onSuccess: () => {
        showSuccess(t('user:Profile.Updated'));
        refetch();
      },
      onError: (err) => showError(err.message),
    });

  const memoData = useMemo(
    (): UseDashboardUserHookDataSchema => ({
      id,
      nickname: data?.UserProfile?.nickname ?? FallbackString,
      avatar: data?.UserProfile?.avatar ?? FallbackString,
      email: data?.UserProfile?.email ?? FallbackString,
      bio: data?.UserProfile?.bio ?? FallbackString,
      username: data?.username ?? FallbackString,
      role: data?.role ?? AuthRole.User,
      avatarSrc: data?.UserProfile?.avatar,
      avatarText: data?.UserProfile?.nickname?.charAt(0) ?? FallbackString,
      provider: data?.ProviderProfile,
      providerId: data?.ProviderProfile?.id,
      providerName: data?.ProviderProfile?.name,
    }),
    [data, id],
  );

  return {
    router: { data, refetch, isFetching, error, isError, update },
    data: memoData,
  };
};
