import { z } from 'zod';
import { idSchema } from './id';

export const listInputSchema = z.object({
  limit: z.coerce.number().int().gte(5).lte(100).default(20),
  skip: z.coerce.number().int().nonnegative().default(0).optional(),
  cursor: z.string().optional(),
  query: z.string().optional(),
});
export type ListInputSchema = z.infer<typeof listInputSchema>;

export const listItemSchema = z.object({ id: idSchema });
export type ListItemSchema = z.infer<typeof listItemSchema>;

export interface ListOutputSchema<T extends ListItemSchema> {
  items: T[];
  nextCursor?: string | undefined;
  total: number;
}
