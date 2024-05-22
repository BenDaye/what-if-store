import { useGridPagination } from '@/hooks/common';
import type { UserApiKeyListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useAppUserApiKeysWithPagination = (input?: UserApiKeyListInputSchema) => {
  const {
    pagination: { page, pageSize },
    setPaginationModel,
    skip,
  } = useGridPagination();
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () =>
      status === 'authenticated' &&
      (session.user?.role === AuthRole.User || session.user?.role === AuthRole.Provider),
    [status, session],
  );
  const { data, isFetching, refetch, error, isError } = trpc.protectedAppUserApiKey.list.useQuery(
    {
      limit: pageSize,
      skip,
      query: input?.query,
    },
    { enabled: authenticated },
  );

  trpc.protectedAppUserApiKey.subscribe.useSubscription(undefined, {
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