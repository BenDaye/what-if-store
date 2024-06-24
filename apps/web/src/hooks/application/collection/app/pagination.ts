import { useGridPagination } from '@/hooks/common';
import { trpc } from '@what-if-store/server/react/trpc';
import type { ApplicationCollectionListInputSchema } from '@what-if-store/server/server/schemas';

export const useAppApplicationCollectionsWithPagination = (input?: ApplicationCollectionListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, error, isError } = trpc.publicAppApplicationCollection.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppApplicationCollection.subscribe.useSubscription(undefined, {
    onData: () => refetch(),
  });

  return {
    router: { data, refetch, isFetching, error, isError },
    total: data?.total ?? 0,
    items: data?.items ?? [],
    pagination: {
      page,
      pageSize,
      setPaginationModel,
    },
  };
};
