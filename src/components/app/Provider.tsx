import { AuthProvider } from '@/hooks';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useEffect } from 'react';

export const AppProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const router = useRouter();
  const { data: session } = useSession();

  // detect user role is match with route
  useEffect(() => {
    if (
      session?.user?.role === AuthRole.ADMIN &&
      !router.pathname.startsWith('/dashboard')
    ) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return <AuthProvider>{children}</AuthProvider>;
};
