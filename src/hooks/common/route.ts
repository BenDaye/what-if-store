import { useRouter } from 'next/router';
import { useMemo } from 'react';

export type ClientSide = 'app' | 'dashboard';
export type KnownRoute = 'character' | 'weapon' | 'armor' | 'asset' | 'user';
export const useCurrentRouteId = (
  side: ClientSide,
  route: KnownRoute,
): {
  id: string | null;
  valid: boolean;
  isMy: boolean;
} => {
  const router = useRouter();
  const { id } = router.query;
  const valid = useMemo<boolean>(
    () =>
      router.pathname.startsWith(`/${side}/${route}/[id]`) &&
      typeof id === 'string' &&
      !!id,
    [id, router, side, route],
  );
  const isMy = useMemo<boolean>(
    () => router.pathname.endsWith(`/my`),
    [router],
  );

  return { id: valid ? (id as string) : null, valid, isMy };
};
