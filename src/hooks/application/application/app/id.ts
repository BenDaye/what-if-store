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
} from '@prisma/client';
import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

type AppApplicationRouterOutput =
  RouterOutput['protectedAppApplication']['getById'];
export const useAppApplicationHookDataSchema = applicationCreateInputSchema
  .extend({
    id: idSchema,
    priceText: z.string(),
    status: z.nativeEnum(ApplicationStatus),

    provider: z.object({ id: idSchema }).optional(),

    count: z.custom<AppApplicationRouterOutput['_count']>(),

    versions: z.custom<AppApplicationRouterOutput['VersionHistories']>(),
    latestVersion: z
      .custom<AppApplicationRouterOutput['VersionHistories'][number]>()
      .optional(),
    latestVersionText: applicationVersionCreateInputSchema.shape.version,

    followers: z.custom<AppApplicationRouterOutput['Followers']>(),
    owners: z.custom<AppApplicationRouterOutput['Owners']>(),
    collections: z.custom<AppApplicationRouterOutput['Collections']>(),
    groups: z.custom<AppApplicationRouterOutput['Groups']>(),
    tags: z.custom<AppApplicationRouterOutput['Tags']>(),

    assets: z.custom<AppApplicationRouterOutput['Assets']>(),
    icons: z.custom<AppApplicationRouterOutput['Assets']>(),
    primaryIcon: z
      .custom<AppApplicationRouterOutput['Assets'][number]>()
      .optional(),
    primaryIconText: z.string(),
    backgrounds: z.custom<AppApplicationRouterOutput['Assets']>(),
    primaryBackground: z
      .custom<AppApplicationRouterOutput['Assets'][number]>()
      .optional(),
    banners: z.custom<AppApplicationRouterOutput['Assets']>(),
    primaryBanner: z
      .custom<AppApplicationRouterOutput['Assets'][number]>()
      .optional(),
    screenshots: z.custom<AppApplicationRouterOutput['Assets']>(),
    privacyPolicy: z.string().optional(),
    termsOfUse: z.string().optional(),
    copyright: z.string().optional(),
    readme: z.string().optional(),
  })
  .strict();
export type UseAppApplicationHookDataSchema = z.infer<
  typeof useAppApplicationHookDataSchema
>;

export const useAppApplication = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } =
    trpc.publicAppApplication.getById.useQuery(id ?? '[UNSET]', {
      enabled: !!id,
    });
  trpc.publicAppApplication.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const memoData = useMemo((): UseAppApplicationHookDataSchema => {
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
