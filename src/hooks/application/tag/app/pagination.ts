import { useGridPagination } from '@/hooks/common';
import { ApplicationTagListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';

export const useAppApplicationTagsWithPagination = (
  input?: ApplicationTagListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch } =
    trpc.publicAppApplicationTag.list.useQuery({
      limit: pageSize,
      skip,
      query: input?.query,
    });

  trpc.publicAppApplicationTag.subscribe.useSubscription(undefined, {
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