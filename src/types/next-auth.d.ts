import type { AuthRole } from '@prisma/client';
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session extends DefaultSession {
    user?: {
      id: string;
      username: string;
      role: AuthRole;
      nickname?: string | null;
      avatar?: string | null;
      bio?: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username: string;
    role: AuthRole;
    avatar?: string | null;
    bio?: string | null;
    nickname?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  export interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: AuthRole;
    nickname?: string | null;
    avatar?: string | null;
    bio?: string | null;
  }
}
