import { useNotice } from '@/hooks/notice';
import {
  ApplicationCreateInputSchema,
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
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

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
      primaryIcon: z
        .custom<DashboardApplicationRouterOutput['Assets'][number]>()
        .optional(),
      primaryIconText: z.string(),
      backgrounds: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      primaryBackground: z
        .custom<DashboardApplicationRouterOutput['Assets'][number]>()
        .optional(),
      banners: z.custom<DashboardApplicationRouterOutput['Assets']>(),
      primaryBanner: z
        .custom<DashboardApplicationRouterOutput['Assets'][number]>()
        .optional(),
      screenshots: z.custom<DashboardApplicationRouterOutput['Assets']>(),
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
      compatibility:
        (data?.Information
          ?.compatibility as ApplicationCreateInputSchema['compatibility']) ??
        [],
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
          ({ type }) => type === ApplicationAssetType.Icon,
        ) ?? [],
      primaryIcon: data?.Assets?.find(
        ({ type, isPrimary }) =>
          type === ApplicationAssetType.Icon && isPrimary,
      ),
      primaryIconText: data?.name?.charAt(0) ?? '-',
      backgrounds:
        data?.Assets?.filter(
          ({ type }) => type === ApplicationAssetType.Background,
        ) ?? [],
      primaryBackground: data?.Assets?.find(
        ({ type, isPrimary }) =>
          type === ApplicationAssetType.Background && isPrimary,
      ),
      banners:
        data?.Assets?.filter(
          ({ type }) => type === ApplicationAssetType.Banner,
        ) ?? [],
      primaryBanner: data?.Assets?.find(
        ({ type, isPrimary }) =>
          type === ApplicationAssetType.Banner && isPrimary,
      ),
      screenshots:
        data?.Assets?.filter(
          ({ type }) => type === ApplicationAssetType.Screenshot,
        ) ?? [],
      privacyPolicy: data?.Assets?.find(
        ({ type, name }) =>
          type === ApplicationAssetType.File && name === 'PrivacyPolicy',
      )?.id,
      termsOfUse: data?.Assets?.find(
        ({ type, name }) =>
          type === ApplicationAssetType.File && name === 'TermsOfUse',
      )?.id,
      copyright: data?.Assets?.find(
        ({ type, name }) =>
          type === ApplicationAssetType.File && name === 'Copyright',
      )?.id,
      readme: data?.Assets?.find(
        ({ type, name }) =>
          type === ApplicationAssetType.File && name === 'Readme',
      )?.id,
    };
  }, [id, data]);

  const { showWarning } = useNotice();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
