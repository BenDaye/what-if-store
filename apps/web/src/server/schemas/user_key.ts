import { z } from 'zod';
import { listInputSchema } from './list';

export const userApiKeyListInputSchema = listInputSchema.extend({}).partial();
export type UserApiKeyListInputSchema = z.infer<typeof userApiKeyListInputSchema>;

export const userApiKeyCreateInputSchema = z.object({
  remark: z.string(),
});
export type UserApiKeyCreateInputSchema = z.infer<typeof userApiKeyCreateInputSchema>;
