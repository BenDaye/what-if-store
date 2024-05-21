import { useNotice } from '@/hooks/notice';
import type { UserListInputSchema } from '@/server/schemas';
import type { RouterOutput } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useInterval } from 'usehooks-ts';

export const useDashboardUsers = (
  input: UserListInputSchema = { limit: 20 },
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
    trpc.protectedDashboardUser.list.useInfiniteQuery(input, {
      enabled: authenticated,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
      if (process.env.NODE_ENV === 'development') console.error(err.message);
    },
  });

  useInterval(fetchNextPage, hasNextPage && fetchAll && !isFetching ? 1000 : null);

  const memoData = useMemo(
    (): RouterOutput['protectedDashboardUser']['list']['items'] =>
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
