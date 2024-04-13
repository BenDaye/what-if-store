import { useGridPagination } from '@/hooks/common';
import { ApplicationCollectionListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useDashboardApplicationCollectionsWithPagination = (
  input?: ApplicationCollectionListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
    [status, session],
  );
  const { data, isFetching, refetch } =
    trpc.protectedDashboardApplicationCollection.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
    );

  trpc.protectedDashboardApplicationCollection.subscribe.useSubscription(
    undefined,
    {
      enabled: authenticated,
      onData: (id) => {
        if (data?.items.findIndex((item) => item.id === id) !== -1) refetch();
      },
    },
  );

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
