import { UploadListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { useGridPagination } from '../common';
export const useDashboardUploadWithPagination = (
  input?: UploadListInputSchema,
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
    trpc.protectedDashboardUpload.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
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