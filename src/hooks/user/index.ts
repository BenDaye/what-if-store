import { UserListInputSchema } from '@/server/schemas';
import { IdSchema } from '@/server/schemas/id';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useGridPagination } from '../common';
import { useNotice } from '../notice';

export const useDashboardUser = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardUser.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const username = useMemo(() => data?.username ?? '-', [data]);
  const role = useMemo(() => data?.role ?? AuthRole.User, [data]);
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

  const { showWarning, showSuccess, showError } = useNotice();
  const { t: tError } = useTranslation('errorMessage');
  const { t: tUser } = useTranslation('user');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  const { mutateAsync: update } =
    trpc.protectedDashboardUser.updateById.useMutation({
      onSuccess: () => {
        showSuccess(tUser('Profile.Updated'));
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
    username,
    role,
    avatarSrc,
    avatarText,
    nickname,
    email,
    bio,
    update,
  };
};

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

  const username = useMemo(() => data?.username ?? '-', [data]);
  const role = useMemo(() => data?.role ?? AuthRole.User, [data]);
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
    update,
  };
};

export const useDashboardUsers = (
  notify = true,
  query?: UserListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
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

export const useDashboardUsersWithPagination = (
  input?: UserListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, isFetching, refetch } =
    trpc.protectedDashboardUser.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
    );

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (id) => {
      if (data?.items.findIndex((item) => item.id === id) !== -1) refetch();
    },
  });

  return {
    data,
    isFetching,
    refetch,
    total: data?.total ?? 0,
    items: data?.items ?? [],
    pagination: {
      page,
      pageSize,
      setPaginationModel,
    },
  };
};
