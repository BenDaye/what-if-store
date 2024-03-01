import { publicProcedure, router } from '../trpc';
import { redisKeyMap } from '../modules';
import { metaSchema } from '../schemas/meta';
import { TRPCError } from '@trpc/server';

export const publicAppMeta = router({
  get: publicProcedure.output(metaSchema).query(async ({ ctx: { redis } }) => {
    const title =
      (await redis.get(redisKeyMap.metaAppTitle)) ?? 'What If Example';
    const description =
      (await redis.get(redisKeyMap.metaAppDescription)) ?? 'What If... Example';

    const valid = metaSchema.safeParse({ title, description });
    if (!valid.success)
      throw new TRPCError({
        code: 'PARSE_ERROR',
        message: valid.error.message,
        cause: valid.error.cause,
      });

    return valid.data;
  }),
});

export const protectedAppMeta = router({});

export const publicDashboardMeta = router({
  get: publicProcedure.output(metaSchema).query(async ({ ctx: { redis } }) => {
    const title =
      (await redis.get(redisKeyMap.metaAppTitle)) ??
      'What If Example Dashboard';
    const description =
      (await redis.get(redisKeyMap.metaAppDescription)) ?? 'What If... Example';

    const valid = metaSchema.safeParse({ title, description });
    if (!valid.success)
      throw new TRPCError({
        code: 'PARSE_ERROR',
        message: valid.error.message,
        cause: valid.error.cause,
      });

    return valid.data;
  }),
});

export const protectedDashboardMeta = router({});
