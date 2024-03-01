import { IdSchema } from '@/server/schemas/id';
import { UserListInputSchema } from '@/server/schemas/user';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useCurrentRouteId } from '../common';
import { useNotice } from '../notice';

export const useAppUserCurrentRouterId = () => useCurrentRouteId('app', 'user');

export const useDashboardUserCurrentRouterId = () =>
  useCurrentRouteId('dashboard', 'user');

export const useDashboardUser = (id?: IdSchema | null) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardUser.getProfileById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
      queryKey: ['protectedDashboardUser.getProfileById', id ?? '[UNSET]'],
    });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const username = useMemo(() => data?.username ?? '', [data]);
  const role = useMemo(() => data?.role ?? AuthRole.USER, [data]);
  const avatarText = useMemo(() => data?.username?.charAt(0) ?? '', [data]);

  const nickname = useMemo(() => data?.UserProfile?.nickname ?? '', [data]);
  const email = useMemo(() => data?.UserProfile?.email ?? '', [data]);

  const router = useRouter();
  const { showWarning } = useNotice();
  const { id: routerId, valid } = useDashboardUserCurrentRouterId();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    if (!valid) return;

    if (error.message === 'No User found') {
      showWarning(tError(error.message), { persist: false });
      router.replace('/dashboard/user');
      return;
    }
  }, [isError, routerId, valid, router, error, showWarning, tError]);

  return {
    data,
    refetch,
    isFetching,
    error,
    isError,
    username,
    role,
    avatarText,
    nickname,
    email,
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
      queryKey: [
        'protectedDashboardUser.list',
        query ?? {
          limit: 20,
        },
      ],
      enabled: authenticated,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined,
    },
  );

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  useEffect(() => {
    setFlattedData(data?.items ?? []);
  }, [data]);

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
    },
  });

  useInterval(fetchNextPage, hasNextPage && !isFetching ? 1000 : null);

  const adminData = useMemo(
    () => data?.items.filter((item) => item.role === AuthRole.ADMIN) ?? [],
    [data],
  );

  const userData = useMemo(
    () => data?.items.filter((item) => item.role === AuthRole.USER) ?? [],
    [data],
  );

  return {
    data,
    flattedData,
    firstItem: flattedData?.[0],
    isFetched,
    isFetching,
    error,
    adminData,
    userData,
  };
};
