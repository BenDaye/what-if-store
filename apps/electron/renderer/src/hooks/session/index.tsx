import { RefetchOptions } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useMemo } from 'react';
import { trpc } from '../trpc';

type ISODateString = string;
export interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id: string;
    username: string;
    role: string;
    nickname?: string | null;
    avatar?: string | null;
    bio?: string | null;
    country?: string | null;
  };
  expires: ISODateString;
}

export interface SessionProviderProps extends PropsWithChildren {
  baseUrl?: string;
  basePath?: string;
  /**
   * A time interval (in seconds) after which the session will be re-fetched.
   * If set to `0` (default), the session is not polled.
   */
  refetchInterval?: number | false;
  /**
   * `SessionProvider` automatically refetches the session when the user switches between windows.
   * This option activates this behaviour if set to `true` (default).
   */
  refetchOnWindowFocus?: boolean;
}

export type SessionContextValue = {
  update: (opts?: RefetchOptions) => Promise<any>;
  data: Session | null;
  status: 'unauthenticated' | 'loading' | 'authenticated';
};

export const SessionContext = createContext?.<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider = ({
  children,
  refetchInterval = false,
  refetchOnWindowFocus = true,
}: SessionProviderProps) => {
  if (!SessionContext)
    throw new Error(
      'SessionProvider must be used within a SessionContext.Provider',
    );

  const { data, isSuccess, isFetching, refetch } =
    trpc.publicAppAuth.session.useQuery(undefined, {
      placeholderData: { user: null, expires: '' },
      refetchInterval,
      refetchOnWindowFocus,
    });

  const value: SessionContextValue = useMemo(
    () => ({
      data: data as Session | null,
      status: isFetching
        ? 'loading'
        : isSuccess
          ? 'authenticated'
          : 'unauthenticated',
      update: refetch,
    }),
    [data, isFetching, isSuccess, refetch],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
