import { withAuth } from 'next-auth/middleware';
import { AuthRole } from '@what-if-store/prisma/client';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === AuthRole.Admin,
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
