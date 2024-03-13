import { ProviderListInputSchema } from '@/server/schemas';
import { IdSchema } from '@/server/schemas/id';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole, ProviderType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useNotice } from '../notice';

export const useAppProvider = (id: IdSchema) => {
  const { data, isFetching, refetch, error, isError } =
    trpc.publicAppProvider.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id,
    });
  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const name = useMemo(() => data?.name ?? '-', [data]);
  const type = useMemo(() => data?.type ?? ProviderType.Community, [data]);
  const avatarSrc = useMemo(() => data?.avatar || undefined, [data]);
  const avatarText = useMemo(() => data?.name?.charAt(0) ?? '-', [data]);

  const email = useMemo(() => data?.email ?? '-', [data]);

  const bio = useMemo(() => data?.bio ?? '-', [data]);

  const verified = useMemo(() => data?.verified ?? false, [data]);

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  return {
    data,
    refetch,
    isFetching,
    error,
    isError,
    name,
    type,
    avatarSrc,
    avatarText,
    email,
    bio,
    verified,
  };
};

export const useAppProviderMy = () => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () =>
      status === 'authenticated' && session.user?.role === AuthRole.Provider,
    [status, session],
  );

  const { data, isFetching, refetch, error, isError } =
    trpc.protectedAppProvider.get.useQuery(undefined, {
      enabled: authenticated,
    });
  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === session?.user?.id) refetch();
    },
  });

  const name = useMemo(() => data?.name ?? '-', [data]);
  const type = useMemo(() => data?.type ?? ProviderType.Community, [data]);
  const avatarSrc = useMemo(() => data?.avatar || undefined, [data]);
  const avatarText = useMemo(() => data?.name?.charAt(0) ?? '-', [data]);

  const email = useMemo(() => data?.email ?? '-', [data]);

  const bio = useMemo(() => data?.bio ?? '-', [data]);

  const verified = useMemo(() => data?.verified ?? false, [data]);

  const { showWarning, showSuccess, showError } = useNotice();
  const { t: tError } = useTranslation('errorMessage');
  const { t: tProvider } = useTranslation('provider');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  const { mutateAsync: create } = trpc.protectedAppProvider.create.useMutation({
    onSuccess: () => {
      showSuccess(tProvider('Profile.Created'));
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  const { mutateAsync: update } = trpc.protectedAppProvider.update.useMutation({
    onSuccess: () => {
      showSuccess(tProvider('Profile.Updated'));
      refetch();
    },
    onError: (err) => showError(err.message),
  });

  return {
    data,
    refetch,
    isFetching,
    error,
    isError,
    name,
    type,
    avatarSrc,
    avatarText,
    email,
    bio,
    verified,
    create,
    update,
  };
};

export const useDashboardProvider = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardProvider.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardProvider.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const name = useMemo(() => data?.name ?? '-', [data]);
  const type = useMemo(() => data?.type ?? ProviderType.Community, [data]);
  const avatarSrc = useMemo(() => data?.avatar || undefined, [data]);
  const avatarText = useMemo(() => data?.name?.charAt(0) ?? '-', [data]);

  const email = useMemo(() => data?.email ?? '-', [data]);

  const bio = useMemo(() => data?.bio ?? '-', [data]);

  const verified = useMemo(() => data?.verified ?? false, [data]);

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  return {
    data,
    refetch,
    isFetching,
    error,
    isError,
    name,
    type,
    avatarSrc,
    avatarText,
    email,
    bio,
    verified,
  };
};

export const useDashboardProviders = (
  notify = true,
  query?: ProviderListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { showWarning } = useNotice();
  const [flattedData, setFlattedData] = useState<
    RouterOutput['protectedDashboardProvider']['list']['items']
  >([]);
  const {
    hasNextPage,
    fetchNextPage,
    isFetched,
    isFetching,
    data,
    error,
    isError,
    refetch,
  } = trpc.protectedDashboardProvider.list.useInfiniteQuery(
    {
      limit: 20,
      ...query,
    },
    {
      enabled: authenticated,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  useEffect(() => {
    setFlattedData(data?.pages.flatMap((page) => page.items) ?? []);
  }, [data]);

  trpc.protectedDashboardProvider.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
    },
  });

  useInterval(fetchNextPage, hasNextPage && !isFetching ? 1000 : null);

  return {
    data,
    flattedData,
    isFetched,
    isFetching,
    error,
  };
};
