import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const applicationTagListInputSchema = listInputSchema.partial();
export type ApplicationTagListInputSchema = z.infer<typeof applicationTagListInputSchema>;

export const applicationTagCreateInputSchema = z.object({
  name: z.string(),
});
export type ApplicationTagCreateInputSchema = z.infer<typeof applicationTagCreateInputSchema>;

export const applicationTagUpdateInputSchema = applicationTagCreateInputSchema.partial().extend({
  id: idSchema,
});
export type ApplicationTagUpdateInputSchema = z.infer<typeof applicationTagUpdateInputSchema>;
