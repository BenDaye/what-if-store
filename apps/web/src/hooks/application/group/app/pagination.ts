import { useGridPagination } from '@/hooks/common';
import { trpc } from '@what-if-store/server/react/trpc';
import type { ApplicationGroupListInputSchema } from '@what-if-store/server/server/schemas';

export const useAppApplicationGroupsWithPagination = (input?: ApplicationGroupListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, error, isError } = trpc.publicAppApplicationGroup.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppApplicationGroup.subscribe.useSubscription(undefined, {
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
