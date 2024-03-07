import { UserListInputSchema } from '@/server/schemas';
import { IdSchema } from '@/server/schemas/id';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useNotice } from '../notice';

export const useDashboardUser = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardUser.getProfileById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const username = useMemo(() => data?.username ?? '-', [data]);
  const role = useMemo(() => data?.role ?? AuthRole.USER, [data]);
  const avatarSrc = useMemo(
    () => data?.UserProfile?.avatar || undefined,
    [data],
  );
  const avatarText = useMemo(
    () =>
      data?.UserProfile?.nickname?.charAt(0) ??
      data?.username?.charAt(0) ??
      '-',
    [data],
  );

  const nickname = useMemo(
    () => data?.UserProfile?.nickname ?? data?.username ?? '-',
    [data],
  );

  const email = useMemo(() => data?.UserProfile?.email ?? '-', [data]);

  const bio = useMemo(() => data?.UserProfile?.bio ?? '-', [data]);

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
    username,
    role,
    avatarSrc,
    avatarText,
    nickname,
    email,
    bio,
  };
};

export const useDashboardUsers = (
  notify = true,
  query?: UserListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { showWarning } = useNotice();
  const [flattedData, setFlattedData] = useState<
    RouterOutput['protectedDashboardUser']['list']['items']
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
  } = trpc.protectedDashboardUser.list.useInfiniteQuery(
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

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
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
