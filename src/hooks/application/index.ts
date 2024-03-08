import { ApplicationListInputSchema } from '@/server/schemas';
import { IdSchema } from '@/server/schemas/id';
import { RouterOutput, trpc } from '@/utils/trpc';
import { ApplicationCategory, AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useNotice } from '../notice';

export const useDashboardApplication = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardApplication.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardApplication.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const name = useMemo(() => data?.name ?? '-', [data]);
  const category = useMemo(
    () => data?.category ?? ApplicationCategory.Other,
    [data],
  );
  const avatarSrc = useMemo(
    () => data?.ApplicationInformation?.logo || undefined,
    [data],
  );
  const avatarText = useMemo(() => data?.name?.charAt(0) ?? '-', [data]);

  const website = useMemo(
    () => data?.ApplicationInformation?.website ?? '-',
    [data],
  );

  const description = useMemo(
    () => data?.ApplicationInformation?.description ?? '-',
    [data],
  );

  const author = useMemo(() => data?.author, [data]);

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  return {
    data,
    refetch,
    isFetching,
    error,
    isError,
    name,
    category,
    avatarSrc,
    avatarText,
    website,
    description,
    author,
  };
};

export const useDashboardApplications = (
  notify = true,
  query?: ApplicationListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { showWarning } = useNotice();
  const [flattedData, setFlattedData] = useState<
    RouterOutput['protectedDashboardApplication']['list']['items']
  >([]);
  const {
    hasNextPage,
    fetchNextPage,
    isFetched,
    isFetching,
    data,
    error,
    isError,
    refetch,
  } = trpc.protectedDashboardApplication.list.useInfiniteQuery(
    {
      limit: 20,
      ...query,
    },
    {
      enabled: authenticated,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (!notify) return;
    if (!isError) return;

    showWarning(error.message);
  }, [error, isError, showWarning, notify]);

  useEffect(() => {
    setFlattedData(data?.pages.flatMap((page) => page.items) ?? []);
  }, [data]);

  trpc.protectedDashboardApplication.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: () => refetch(),
    onError: (err) => {
      if (notify) showWarning(err.message);
    },
  });

  useInterval(fetchNextPage, hasNextPage && !isFetching ? 1000 : null);

  return {
    data,
    flattedData,
    isFetched,
    isFetching,
    error,
  };
};
