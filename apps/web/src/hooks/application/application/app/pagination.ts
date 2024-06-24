import { useGridPagination } from '@/hooks/common';
import type { ApplicationListInputSchema } from '@/server/schemas';
import { trpc } from '@what-if-store/server/react/trpc';

export const useAppApplicationsWithPagination = (input?: ApplicationListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, error, isError } = trpc.publicAppApplication.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppApplication.subscribe.useSubscription(undefined, {
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
