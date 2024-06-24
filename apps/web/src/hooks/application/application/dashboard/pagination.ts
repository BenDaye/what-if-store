import { useGridPagination } from '@/hooks/common';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { AuthRole } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/next/trpc';
import type { ApplicationListInputSchema } from '@what-if-store/server/server/schemas';

export const useDashboardApplicationsWithPagination = (input?: ApplicationListInputSchema) => {
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
  const { data, isFetching, refetch, error, isError } = trpc.protectedDashboardApplication.list.useQuery(
    {
      limit: pageSize,
      skip,
      query: input?.query,
    },
    { enabled: authenticated },
  );

  trpc.protectedDashboardApplication.subscribe.useSubscription(undefined, {
    enabled: authenticated,
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
