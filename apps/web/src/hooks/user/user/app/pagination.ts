import { useGridPagination } from '@/hooks/common';
import { useNotice } from '@/hooks/notice';
import type { UserListInputSchema } from '@/server/schemas';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { trpc } from '@what-if-store/server/react/trpc';

export const useAppUsersWithPagination = (input?: UserListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data, isFetching, refetch, isError, error } = trpc.publicAppUser.list.useQuery({
    limit: pageSize,
    skip,
    query: input?.query,
  });

  trpc.publicAppUser.subscribe.useSubscription(undefined, {
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
