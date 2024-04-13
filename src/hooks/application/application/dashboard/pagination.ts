import { useGridPagination } from '@/hooks/common';
import { ApplicationListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useDashboardApplicationsWithPagination = (
  input?: ApplicationListInputSchema,
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
    trpc.protectedDashboardApplication.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
    );

  trpc.protectedDashboardApplication.subscribe.useSubscription(undefined, {
    enabled: authenticated,
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
