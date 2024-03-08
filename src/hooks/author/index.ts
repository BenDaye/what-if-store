import { AuthorListInputSchema } from '@/server/schemas';
import { IdSchema } from '@/server/schemas/id';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole, AuthorType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useNotice } from '../notice';

export const useDashboardAuthor = (id: IdSchema) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { data, refetch, isFetching, error, isError } =
    trpc.protectedDashboardAuthor.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id && authenticated,
    });
  trpc.protectedDashboardAuthor.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const name = useMemo(() => data?.name ?? '-', [data]);
  const type = useMemo(() => data?.type ?? AuthorType.Community, [data]);
  const avatarSrc = useMemo(
    () => data?.AuthorProfile?.avatar || undefined,
    [data],
  );
  const avatarText = useMemo(() => data?.name?.charAt(0) ?? '-', [data]);

  const email = useMemo(() => data?.AuthorProfile?.email ?? '-', [data]);

  const bio = useMemo(() => data?.AuthorProfile?.bio ?? '-', [data]);

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
    type,
    avatarSrc,
    avatarText,
    email,
    bio,
  };
};

export const useDashboardAuthors = (
  notify = true,
  query?: AuthorListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.ADMIN,
    [status, session],
  );
  const { showWarning } = useNotice();
  const [flattedData, setFlattedData] = useState<
    RouterOutput['protectedDashboardAuthor']['list']['items']
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
  } = trpc.protectedDashboardAuthor.list.useInfiniteQuery(
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

  trpc.protectedDashboardAuthor.subscribe.useSubscription(undefined, {
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
