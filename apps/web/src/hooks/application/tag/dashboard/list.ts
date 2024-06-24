import { useNotice } from '@/hooks/notice';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useInterval } from 'usehooks-ts';
import { AuthRole } from '@what-if-store/prisma/client';
import type { RouterOutput } from '@what-if-store/server/next/trpc';
import { trpc } from '@what-if-store/server/next/trpc';
import type { ApplicationTagListInputSchema } from '@what-if-store/server/server/schemas';

export const useDashboardApplicationTags = (
  query?: ApplicationTagListInputSchema,
  notify = true,
  fetchAll = true,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { showWarning } = useNotice();
  const { hasNextPage, fetchNextPage, isFetching, data, error, isError, refetch } =
    trpc.protectedDashboardApplicationTag.list.useInfiniteQuery(
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

  trpc.protectedDashboardApplicationTag.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
    },
  });

  useInterval(fetchNextPage, hasNextPage && fetchAll && !isFetching ? 1000 : null);

  const memoData = useMemo(
    (): RouterOutput['protectedDashboardApplicationTag']['list']['items'] =>
      data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  return {
    router: {
      data,
      refetch,
      isFetching,
      error,
      isError,
    },
    data: memoData,
  };
};
