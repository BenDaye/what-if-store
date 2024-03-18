import {
  ApplicationCollectionListInputSchema,
  IdSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useGridPagination, useNotice } from '..';

export const useDashboardApplicationCollection = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplicationCollection.getById.useQuery(
      id ?? '[UNSET]',
      {
        enabled: !!id && authenticated,
      },
    );
  trpc.protectedDashboardApplicationCollection.subscribe.useSubscription(
    undefined,
    {
      enabled: authenticated,
      onData: (_id) => {
        if (_id === id) refetch();
      },
    },
  );

  const name = useMemo(() => data?.name ?? '-', [data]);

  const description = useMemo(() => data?.description ?? '-', [data]);

  const applications = useMemo(() => data?.Applications, [data]);

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
    description,
    applications,
  };
};

export const useDashboardApplicationCollections = (
  notify = true,
  query?: ApplicationCollectionListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { showWarning } = useNotice();
  const [flattedData, setFlattedData] = useState<
    RouterOutput['protectedDashboardApplicationCollection']['list']['items']
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
  } = trpc.protectedDashboardApplicationCollection.list.useInfiniteQuery(
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

  trpc.protectedDashboardApplicationCollection.subscribe.useSubscription(
    undefined,
    {
      enabled: authenticated,
      onData: () => refetch(),
      onError: (err) => {
        if (notify) showWarning(err.message);
      },
    },
  );

  useInterval(fetchNextPage, hasNextPage && !isFetching ? 1000 : null);

  return {
    data,
    flattedData,
    isFetched,
    isFetching,
    error,
  };
};

export const useDashboardApplicationCollectionsWithPagination = (
  input?: ApplicationCollectionListInputSchema,
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
    trpc.protectedDashboardApplicationCollection.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
    );

  trpc.protectedDashboardApplicationCollection.subscribe.useSubscription(
    undefined,
    {
      enabled: authenticated,
      onData: (id) => {
        if (data?.items.findIndex((item) => item.id === id) !== -1) refetch();
      },
    },
  );

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
