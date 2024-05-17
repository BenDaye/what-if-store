import { useNotice } from '@/hooks/notice';
import { ApplicationCollectionListInputSchema } from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { useEffect, useMemo } from 'react';
import { useInterval } from 'usehooks-ts';

export const useAppApplicationCollections = (
  query?: ApplicationCollectionListInputSchema,
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
  } = trpc.publicAppApplicationCollection.list.useInfiniteQuery(
    {
      limit: 20,
      ...query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  trpc.publicAppApplicationCollection.subscribe.useSubscription(undefined, {
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
    },
  });

  useInterval(
    fetchNextPage,
    hasNextPage && fetchAll && !isFetching ? 1000 : null,
  );

  const memoData = useMemo(
    (): RouterOutput['publicAppApplicationCollection']['list']['items'] =>
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
