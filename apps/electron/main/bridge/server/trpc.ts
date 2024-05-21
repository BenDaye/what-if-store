import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v11/data-transformers
   */
  transformer: SuperJSON,
  /**
   * @see https://trpc.io/docs/v11/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError ? error.cause.flatten() : null,
        ...shape.data,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const isAuthorizedMiddleware = t.middleware(async ({ ctx, next }) => {
  if (typeof ctx.apiKey === 'undefined') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }
  return next({
    ctx: {
      apiKey: ctx.apiKey,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthorizedMiddleware);
