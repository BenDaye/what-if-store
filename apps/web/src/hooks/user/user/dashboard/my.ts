import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import type { UseDashboardUserHookDataSchema } from './id';

export const useDashboardUserMy = () => {
  const { data: session, status, update: updateSession } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } = trpc.protectedDashboardUser.get.useQuery(undefined, {
    enabled: authenticated,
  });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === session?.user?.id) refetch();
    },
  });

  const { showWarning, showSuccess, showError } = useNotice();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  const { mutateAsync: update } = trpc.protectedDashboardUser.update.useMutation({
    onSuccess: async (response) => {
      showSuccess(t('user:Profile.Updated'));
      await updateSession(response);
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  const memoData = useMemo(
    (): UseDashboardUserHookDataSchema => ({
      id: session?.user?.id ?? FallbackId,
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
    [data, session?.user?.id],
  );

  return {
    router: { data, refetch, isFetching, error, isError, update },
    data: memoData,
  };
};
