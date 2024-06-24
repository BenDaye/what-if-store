import { useGridPagination } from '@/hooks/common';
import { trpc } from '@what-if-store/server/react/trpc';
import type { ApplicationTagListInputSchema } from '@what-if-store/server/server/schemas';

export const useAppApplicationTagsWithPagination = (input?: ApplicationTagListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, error, isError } = trpc.publicAppApplicationTag.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppApplicationTag.subscribe.useSubscription(undefined, {
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
