import { useNotice } from '@/hooks/notice';
import {
  IdSchema,
  idSchema,
  userUpdateProfileInputSchema,
} from '@/server/schemas';
import { RouterOutput, trpc } from '@/utils/trpc';
import { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

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
  const { data, refetch, isFetching, error, isError } =
    trpc.publicAppUser.getById.useQuery(id, {
      enabled: !!id,
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
      nickname: data?.UserProfile?.nickname ?? '-',
      avatar: data?.UserProfile?.avatar ?? '-',
      email: data?.UserProfile?.email ?? '-',
      bio: data?.UserProfile?.bio ?? '-',
      username: data?.username ?? '-',
      role: data?.role ?? AuthRole.User,
      avatarSrc: data?.UserProfile?.avatar,
      avatarText: data?.UserProfile?.nickname?.charAt(0) ?? '-',
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
