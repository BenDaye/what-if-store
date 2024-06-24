import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { AuthRole } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/react/trpc';
import type { UploadListInputSchema } from '@what-if-store/server/server/schemas';
import { useGridPagination } from '../common';

export const useDashboardUploadWithPagination = (input?: UploadListInputSchema) => {
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
  const { data, isFetching, refetch, error, isError } = trpc.protectedDashboardUpload.list.useQuery(
    {
      limit: pageSize,
      skip,
      query: input?.query,
    },
    { enabled: authenticated },
  );

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
