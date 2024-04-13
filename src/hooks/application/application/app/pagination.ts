import { useGridPagination } from '@/hooks/common';
import { ApplicationListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';

export const useAppApplicationsWithPagination = (
  input?: ApplicationListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch } = trpc.publicAppApplication.list.useQuery(
    {
      limit: pageSize,
      skip,
      query: input?.query,
    },
  );

  trpc.publicAppApplication.subscribe.useSubscription(undefined, {
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
