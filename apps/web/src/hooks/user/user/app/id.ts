import { FallbackId, FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks/notice';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { AuthRole } from '@what-if-store/prisma/client';
import type { RouterOutput } from '@what-if-store/server/next/trpc';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { idSchema, userUpdateProfileInputSchema } from '@what-if-store/server/server/schemas';

type AppUserRouterOutput = RouterOutput['publicAppUser']['getById'];
export const useAppUserHookDataSchema = userUpdateProfileInputSchema
  .extend({
    id: idSchema,
    username: z.string(),
    role: z.nativeEnum(AuthRole),
    avatarSrc: z.string().nullable().optional(),
    avatarText: z.string(),
    provider: z.custom<AppUserRouterOutput['ProviderProfile']>().optional(),
    providerId: z.string().optional(),
    providerName: z.string().optional(),
  })
  .strict();
export type UseAppUserHookDataSchema = z.infer<typeof useAppUserHookDataSchema>;

export const useAppUser = (id: IdSchema) => {
  const { data, refetch, isFetching, error, isError } = trpc.publicAppUser.getById.useQuery(id, {
    enabled: !!id && id !== FallbackId,
  });
  trpc.publicAppUser.subscribe.useSubscription(undefined, {
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
    (): UseAppUserHookDataSchema => ({
      id,
      nickname: data?.UserProfile?.nickname ?? FallbackString,
      avatar: data?.UserProfile?.avatar ?? FallbackString,
      email: data?.UserProfile?.email ?? FallbackString,
      bio: data?.UserProfile?.bio ?? FallbackString,
      username: data?.username ?? FallbackString,
      role: data?.role ?? AuthRole.User,
      avatarSrc: data?.UserProfile?.avatar,
      avatarText: data?.UserProfile?.nickname?.charAt(0) ?? FallbackString,
      provider: data?.ProviderProfile,
      providerId: data?.ProviderProfile?.id,
      providerName: data?.ProviderProfile?.name,
    }),
    [data, id],
  );

  return {
    router: { data, refetch, isFetching, error, isError },
    data: memoData,
  };
};
