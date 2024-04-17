import { useNotice } from '@/hooks/notice';
import { trpc } from '@/utils/trpc';
import { AuthRole, ProviderType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { UseAppProviderHookDataSchema } from './id';

export const useAppProviderMy = () => {
  const { data: session, status, update: updateSession } = useSession();
  const authenticated = useMemo(
    () =>
      status === 'authenticated' &&
      (session.user?.role === AuthRole.User ||
        session.user?.role === AuthRole.Provider),
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedAppProvider.get.useQuery(undefined, {
      enabled: authenticated,
    });
  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
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

  const { mutateAsync: update } = trpc.protectedAppProvider.update.useMutation({
    onSuccess: async (response) => {
      showSuccess(t('user:Profile.Updated'));
      await updateSession(response);
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  const memoData = useMemo(
    (): UseAppProviderHookDataSchema => ({
      id: session?.user?.id ?? '',
      name: data?.name ?? '-',
      avatar: data?.avatar ?? '-',
      email: data?.email ?? '-',
      bio: data?.bio ?? '-',
      type: data?.type ?? ProviderType.IndependentDeveloper,
      avatarSrc: data?.avatar,
      avatarText: data?.name?.charAt(0) ?? '-',
      userId: data?.userId ?? '',
      verified: data?.verified ?? false,
    }),
    [data, session?.user?.id],
  );

  return {
    router: { data, refetch, isFetching, error, isError, update },
    data: memoData,
  };
};
