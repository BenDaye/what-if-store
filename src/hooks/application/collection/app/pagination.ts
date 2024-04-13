import { useGridPagination } from '@/hooks/common';
import { ApplicationCollectionListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';

export const useAppApplicationCollectionsWithPagination = (
  input?: ApplicationCollectionListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch } =
    trpc.publicAppApplicationCollection.list.useQuery({
      limit: pageSize,
      skip,
      query: input?.query,
    });

  trpc.publicAppApplicationCollection.subscribe.useSubscription(undefined, {
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
