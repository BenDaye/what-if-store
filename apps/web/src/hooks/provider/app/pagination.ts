import { useGridPagination } from '@/hooks/common';
import { useNotice } from '@/hooks/notice';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { trpc } from '@what-if-store/server/react/trpc';
import type { ProviderListInputSchema } from '@what-if-store/server/server/schemas';

export const useAppProvidersWithPagination = (input?: ProviderListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, isError, error } = trpc.publicAppProvider.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
    onData: () => refetch(),
  });

  const { showWarning } = useNotice();
  const { t } = useTranslation();
  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

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
