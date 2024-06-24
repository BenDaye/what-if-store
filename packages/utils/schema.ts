import z from 'zod';

export const idSchema = z.string().uuid();
export type IdSchema = z.infer<typeof idSchema>;

export const listItemBaseSchema = z.object({
  id: idSchema,
});
export type ListItemBaseSchema = z.infer<typeof listItemBaseSchema>;

export interface ListOutputSchema<T extends ListItemBaseSchema> {
  items: T[];
  nextCursor?: string | undefined;
  total: number;
}

export const listInputSchema = z
  .object({
    limit: z.coerce.number().int().gte(5).lte(100).default(20),
    skip: z.coerce.number().int().nonnegative().default(0),
    cursor: z.union([z.string(), idSchema]),
    query: z.string(),
  })
  .partial();
export type ListInputSchema = z.infer<typeof listInputSchema>;
