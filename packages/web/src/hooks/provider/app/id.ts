import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  idSchema,
  providerUpdateProfileInputSchema,
} from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { ProviderType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

// type AppProviderRouterOutput = RouterOutput['publicAppProvider']['getById'];
export const useAppProviderHookDataSchema = providerUpdateProfileInputSchema
  .extend({
    id: idSchema,
    type: z.nativeEnum(ProviderType),
    avatarSrc: z.string().nullable().optional(),
    avatarText: z.string(),
    userId: z.string(),
    verified: z.boolean(),
  })
  .strict();
export type UseAppProviderHookDataSchema = z.infer<
  typeof useAppProviderHookDataSchema
>;

export const useAppProvider = (id: IdSchema) => {
  const { data, isFetching, refetch, error, isError } =
    trpc.publicAppProvider.getById.useQuery(id, {
      enabled: !!id && id !== FallbackId,
    });
  trpc.publicAppProvider.subscribe.useSubscription(undefined, {
    onData: (_id) => {
      if (_id === id) refetch();
    },
  });

  const { showWarning } = useNotice();
  const { t } = useTranslation();
  useEffect(() => {
    if (!isError) return;
    showWarning(t(`errorMessage:${error.message}`));
  }, [isError, error, showWarning, t]);

  const memoData = useMemo(
    (): UseAppProviderHookDataSchema => ({
      id,
      name: data?.name ?? FallbackString,
      avatar: data?.avatar ?? FallbackString,
      email: data?.email ?? FallbackString,
      bio: data?.bio ?? FallbackString,
      type: data?.type ?? ProviderType.IndependentDeveloper,
      avatarSrc: data?.avatar,
      avatarText: data?.name?.charAt(0) ?? FallbackString,
      userId: data?.userId ?? FallbackId,
      verified: data?.verified ?? false,
    }),
    [data, id],
  );

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
