import { AuthProvider } from '@/hooks';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useEffect } from 'react';

export const DashboardProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const router = useRouter();
  const { data: session } = useSession();

  // detect user role is match with route
  useEffect(() => {
    if (
      session?.user?.role === AuthRole.USER &&
      !router.pathname.startsWith('/app')
    ) {
      router.push('/app');
    }
  }, [session, router]);

  return (
    <AuthProvider role={AuthRole.ADMIN} enableSignUp={false}>
      {children}
    </AuthProvider>
  );
};
