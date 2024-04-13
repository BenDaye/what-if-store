import { useGridPagination } from '@/hooks/common';
import { ApplicationGroupListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';

export const useAppApplicationGroupsWithPagination = (
  input?: ApplicationGroupListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch } =
    trpc.publicAppApplicationGroup.list.useQuery({
      limit: pageSize,
      skip,
      query: input?.query,
    });

  trpc.publicAppApplicationGroup.subscribe.useSubscription(undefined, {
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
