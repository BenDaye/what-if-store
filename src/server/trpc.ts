/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { AuthRole } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import { CommonTRPCError } from './utils/errors';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: SuperJSON,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure;

const isAuthorized = t.middleware(async ({ ctx, next }) => {
  if (
    !ctx.session?.user?.id ||
    (ctx.session?.user?.role !== AuthRole.ADMIN &&
      ctx.session?.user?.role !== AuthRole.USER)
  )
    throw new CommonTRPCError('UNAUTHORIZED');

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isAuthorizedUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id || ctx.session?.user?.role !== AuthRole.USER)
    throw new CommonTRPCError('UNAUTHORIZED');

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isAuthorizedAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id || ctx.session?.user?.role !== AuthRole.ADMIN)
    throw new CommonTRPCError('UNAUTHORIZED');

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthorized);
export const protectedUserProcedure = t.procedure.use(isAuthorizedUser);
export const protectedAdminProcedure = t.procedure.use(isAuthorizedAdmin);

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters;
