import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const applicationCollectionListInputSchema = listInputSchema.partial();
export type ApplicationCollectionListInputSchema = z.infer<
  typeof applicationCollectionListInputSchema
>;

export const applicationCollectionCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().nonnegative(),
  applications: z.array(idSchema).min(2),
});
export type ApplicationCollectionCreateInputSchema = z.infer<
  typeof applicationCollectionCreateInputSchema
>;

export const applicationCollectionUpdateInputSchema =
  applicationCollectionCreateInputSchema.partial().extend({
    id: idSchema,
  });
export type ApplicationCollectionUpdateInputSchema = z.infer<
  typeof applicationCollectionUpdateInputSchema
>;
