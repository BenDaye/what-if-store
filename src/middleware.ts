import { AuthRole } from '@prisma/client';
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === AuthRole.ADMIN,
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
