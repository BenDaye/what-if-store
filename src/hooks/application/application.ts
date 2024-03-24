import {
  ApplicationListInputSchema,
  IdSchema,
  applicationCreateInputSchema,
  applicationVersionCreateInputSchema,
  idSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import {
  ApplicationAssetType,
  ApplicationCategory,
  ApplicationStatus,
  AuthRole,
} from '@prisma/client';
import currency from 'currency.js';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { z } from 'zod';
import { useGridPagination, useNotice } from '..';

type DashboardApplicationRouterOutput =
  RouterOutput['protectedDashboardApplication']['getById'];
export const useDashboardApplicationHookDataSchema =
  applicationCreateInputSchema
    .extend({
      id: idSchema,
      priceText: z.string(),
      status: z.nativeEnum(ApplicationStatus),

      provider: z.object({ id: idSchema }).optional(),

      count: z.custom<DashboardApplicationRouterOutput['_count']>(),

      versions:
        z.custom<DashboardApplicationRouterOutput['VersionHistories']>(),
      latestVersion: z
        .custom<DashboardApplicationRouterOutput['VersionHistories'][number]>()
        .optional(),
      latestVersionText: applicationVersionCreateInputSchema.shape.version,

      followers: z.custom<DashboardApplicationRouterOutput['Followers']>(),
      owners: z.custom<DashboardApplicationRouterOutput['Owners']>(),
      collections: z.custom<DashboardApplicationRouterOutput['Collections']>(),
      groups: z.custom<DashboardApplicationRouterOutput['Groups']>(),
      tags: z.custom<DashboardApplicationRouterOutput['Tags']>(),

      assets: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      icons: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      primaryIconSrc: z.string().optional(),
      primaryIconText: z.string(),
      backgrounds: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      primaryBackgroundSrc: z.string().optional(),
      screenshots: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      banners: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      primaryBannerSrc: z.string().optional(),
      privacyPolicy: z.string().optional(),
      termsOfUse: z.string().optional(),
      copyright: z.string().optional(),
      readme: z.string().optional(),
    })
    .strict();
export type UseDashboardApplicationHookDataSchema = z.infer<
  typeof useDashboardApplicationHookDataSchema
>;

export const useDashboardApplication = (id: IdSchema) => {
  const { data: session, status: sessionStatus } = useSession();
  const authenticated = useMemo(
    () =>
      sessionStatus === 'authenticated' &&
      session.user?.role === AuthRole.Admin,
    [sessionStatus, session],
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

  const memoData = useMemo((): UseDashboardApplicationHookDataSchema => {
    return {
      id,
      name: data?.name ?? '-',
      description: data?.description ?? '-',
      category: data?.category ?? ApplicationCategory.Other,
      price: data?.price ?? Number.MAX_VALUE,
      priceText: data?.price ? currency(data?.price).toString() : '-',
      status: data?.status ?? ApplicationStatus.Draft,
      count: data?._count ?? {
        Followers: 0,
        Owners: 0,
        Collections: 0,
        Groups: 0,
        Tags: 0,
        VersionHistories: 0,
        Assets: 0,
      },
      provider: data?.Provider,
      platforms: data?.Information?.platforms ?? [],
      compatibility: data?.Information?.compatibility ?? '[]',
      ageRating: data?.Information?.ageRating ?? '-',
      countries: data?.Information?.countries ?? [],
      locales: data?.Information?.locales ?? [],
      website: data?.Information?.website ?? '-',
      github: data?.Information?.github ?? '-',
      versions: data?.VersionHistories ?? [],
      latestVersion: data?.VersionHistories.find((v) => v.latest),
      latestVersionText:
        data?.VersionHistories.find((v) => v.latest)?.version ?? '-',
      followers: data?.Followers ?? [],
      owners: data?.Owners ?? [],
      collections: data?.Collections ?? [],
      groups: data?.Groups ?? [],
      tags: data?.Tags ?? [],
      // TODO: check if the "isLocal" is true then concat the url with the base url (https://nextjs.org/docs/app/api-reference/components/image#remotepatterns)
      assets: data?.Assets ?? [],
      icons:
        data?.Assets?.filter(
          (asset) => asset.type === ApplicationAssetType.Icon,
        ) ?? [],
      primaryIconSrc: data?.Assets?.find(
        (asset) => asset.type === ApplicationAssetType.Icon && asset.isPrimary,
      )?.url,
      primaryIconText: data?.name?.charAt(0) ?? '-',
      backgrounds:
        data?.Assets?.filter(
          (asset) => asset.type === ApplicationAssetType.Background,
        ) ?? [],
      primaryBackgroundSrc: data?.Assets?.find(
        (asset) =>
          asset.type === ApplicationAssetType.Background && asset.isPrimary,
      )?.url,
      banners:
        data?.Assets?.filter(
          (asset) => asset.type === ApplicationAssetType.Banner,
        ) ?? [],
      primaryBannerSrc: data?.Assets?.find(
        (asset) => asset.type === ApplicationAssetType.Icon && asset.isPrimary,
      )?.url,
      screenshots:
        data?.Assets?.filter(
          (asset) => asset.type === ApplicationAssetType.Screenshot,
        ) ?? [],
      privacyPolicy: data?.Assets?.find(
        (asset) =>
          asset.type === ApplicationAssetType.File &&
          asset.name === 'PrivacyPolicy',
      )?.url,
      termsOfUse: data?.Assets?.find(
        (asset) =>
          asset.type === ApplicationAssetType.File &&
          asset.name === 'TermsOfUse',
      )?.url,
      copyright: data?.Assets?.find(
        (asset) =>
          asset.type === ApplicationAssetType.File &&
          asset.name === 'Copyright',
      )?.url,
      readme: data?.Assets?.find(
        (asset) =>
          asset.type === ApplicationAssetType.File && asset.name === 'Readme',
      )?.url,
    };
  }, [id, data]);

  const { showWarning } = useNotice();
  const { t: tError } = useTranslation('errorMessage');

  useEffect(() => {
    if (!isError) return;
    showWarning(tError(error.message));
  }, [isError, error, showWarning, tError]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};

export const useDashboardApplications = (
  notify = true,
  query?: ApplicationListInputSchema,
) => {
  const { data: session, status } = useSession();
  const authenticated = useMemo(
    () => status === 'authenticated' && session.user?.role === AuthRole.Admin,
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
    onData: (id) => {
      if (flattedData.some((v) => v.id === id)) refetch();
    },
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

export const useDashboardApplicationsWithPagination = (
  input?: ApplicationListInputSchema,
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
    trpc.protectedDashboardApplication.list.useQuery(
      {
        limit: pageSize,
        skip,
        query: input?.query,
      },
      { enabled: authenticated },
    );

  trpc.protectedDashboardApplication.subscribe.useSubscription(undefined, {
    enabled: authenticated,
    onData: (id) => {
      if (data?.items.findIndex((item) => item.id === id) !== -1) refetch();
    },
  });

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
