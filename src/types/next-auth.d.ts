import type { AuthRole } from '@prisma/client';
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session extends DefaultSession {
    user?: {
      id?: string | null;
      username?: string | null;
      role?: AuthRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username?: string | null;
    role?: AuthRole;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  export interface JWT extends DefaultJWT {
    id?: string | null;
    username?: string | null;
    role?: AuthRole;
  }
}
