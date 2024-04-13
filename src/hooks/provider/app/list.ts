import { useNotice } from '@/hooks/notice';
import { ProviderListInputSchema } from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { useEffect, useMemo } from 'react';
import { useInterval } from 'usehooks-ts';

export const useAppProviders = (
  input: ProviderListInputSchema = { limit: 20 },
  notify = true,
  fetchAll = true,
) => {
  const { showWarning } = useNotice();

  const {
    hasNextPage,
    fetchNextPage,
    isFetching,
    data,
    error,
    isError,
    refetch,
  } = trpc.publicAppProvider.list.useInfiniteQuery(input, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
      if (process.env.NODE_ENV === 'development') console.error(err.message);
    },
  });

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  useInterval(
    fetchNextPage,
    hasNextPage && fetchAll && !isFetching ? 1000 : null,
  );

  const memoData = useMemo(
    (): RouterOutput['publicAppProvider']['list']['items'] =>
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
