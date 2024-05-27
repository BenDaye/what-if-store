import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';
import { priceSchema } from './price';

export const applicationCollectionListInputSchema = listInputSchema.partial();
export type ApplicationCollectionListInputSchema = z.infer<typeof applicationCollectionListInputSchema>;

export const applicationCollectionCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: priceSchema.array().min(1),
  applications: z.object({ id: idSchema }).array().min(2),
});
export type ApplicationCollectionCreateInputSchema = z.infer<typeof applicationCollectionCreateInputSchema>;

export const applicationCollectionUpdateInputSchema = applicationCollectionCreateInputSchema
  .partial()
  .extend({
    id: idSchema,
  });
export type ApplicationCollectionUpdateInputSchema = z.infer<typeof applicationCollectionUpdateInputSchema>;
