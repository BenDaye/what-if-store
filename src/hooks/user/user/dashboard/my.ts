import { useNotice } from '@/hooks/notice';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { UseDashboardUserHookDataSchema } from './id';

export const useDashboardUserMy = () => {
  const { data: session, status, update: updateSession } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardUser.get.useQuery(undefined, {
      enabled: authenticated,
    });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === session?.user?.id) refetch();
    },
  });

  const { showWarning, showSuccess, showError } = useNotice();
  const { t: tError } = useTranslation('errorMessage');
  const { t: tUser } = useTranslation('user');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  const { mutateAsync: update } =
    trpc.protectedDashboardUser.update.useMutation({
      onSuccess: async (response) => {
        showSuccess(tUser('Profile.Updated'));
        await updateSession(response);
        refetch();
      },
      onError: (err) => showError(err.message),
    });

  const memoData = useMemo(
    (): UseDashboardUserHookDataSchema => ({
      id: session?.user?.id ?? '',
      nickname: data?.UserProfile?.nickname ?? '-',
      avatar: data?.UserProfile?.avatar ?? '-',
      email: data?.UserProfile?.email ?? '-',
      bio: data?.UserProfile?.bio ?? '-',
      username: data?.username ?? '-',
      role: data?.role ?? AuthRole.User,
      avatarSrc: data?.UserProfile?.avatar,
      avatarText: data?.UserProfile?.nickname?.charAt(0) ?? '-',
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