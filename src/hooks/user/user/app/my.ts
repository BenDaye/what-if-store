import { useNotice } from '@/hooks/notice';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { UseAppUserHookDataSchema } from './id';

export const useAppUserMy = () => {
  const { data: session, status, update: updateSession } = useSession();
  const authenticated = useMemo(
    () =>
      status === 'authenticated' &&
      (session.user?.role === AuthRole.User ||
        session.user?.role === AuthRole.Provider),
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedAppUser.get.useQuery(undefined, {
      enabled: authenticated,
    });
  trpc.publicAppUser.subscribe.useSubscription(undefined, {
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

  const { mutateAsync: update } = trpc.protectedAppUser.update.useMutation({
    onSuccess: async (response) => {
      showSuccess(t('user:Profile.Updated'));
      await updateSession(response);
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  const memoData = useMemo(
    (): UseAppUserHookDataSchema => ({
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
