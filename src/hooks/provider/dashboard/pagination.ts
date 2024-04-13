import { useGridPagination } from '@/hooks/common';
import { useNotice } from '@/hooks/notice';
import { ProviderListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

export const useDashboardProvidersWithPagination = (
  input?: ProviderListInputSchema,
) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, isError, error } =
    trpc.protectedDashboardProvider.list.useQuery({
      limit: pageSize,
      skip,
      query: input?.query,
    });

  trpc.protectedDashboardProvider.subscribe.useSubscription(undefined, {
    onData: (id) => {
      if (data?.items.findIndex((item) => item.id === id) !== -1) refetch();
    },
  });

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');
  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

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
