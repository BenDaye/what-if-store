import { useGridPagination } from '@/hooks/common';
import type { UserListInputSchema } from '@/server/schemas';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { trpc } from '@what-if-store/server/react/trpc';

export const useDashboardUsersWithPagination = (input?: UserListInputSchema) => {
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
  const { data, isFetching, refetch, error, isError } = trpc.protectedDashboardUser.list.useQuery(
    {
      limit: pageSize,
      skip,
      query: input?.query,
    },
    { enabled: authenticated },
  );

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
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
