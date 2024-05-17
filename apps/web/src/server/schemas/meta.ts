import { z } from 'zod';

export const metaSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export type MetaSchema = z.infer<typeof metaSchema>;
