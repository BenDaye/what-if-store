import { z } from 'zod';
import { idSchema } from '.';

export const applicationVersionCreateInputSchema = z.object({
  version: z.string().regex(/^(\d+\.)?(\d+\.)?(\*|\d+)$/),
  releaseDate: z.coerce.date(),
  changelog: z.string().nullable(),
  latest: z.boolean(),
  deprecated: z.boolean(),
  preview: z.boolean(),
});
export type ApplicationVersionCreateInputSchema = z.infer<
  typeof applicationVersionCreateInputSchema
>;

export const applicationVersionUpdateInputSchema =
  applicationVersionCreateInputSchema.partial().extend({ id: idSchema });
export type ApplicationVersionUpdateInputSchema = z.infer<
  typeof applicationVersionUpdateInputSchema
>;
