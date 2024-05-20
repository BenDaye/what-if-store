import { z } from 'zod';

export const startTRPCServerProps = z
  .object({
    port: z.number().nonnegative(),
  })
  .partial();
export type StartTRPCServerProps = z.infer<typeof startTRPCServerProps>;
