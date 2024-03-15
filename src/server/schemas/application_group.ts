import { ApplicationGroupType } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const applicationGroupListInputSchema = listInputSchema
  .extend({
    type: z.nativeEnum(ApplicationGroupType),
  })
  .partial();
export type ApplicationGroupListInputSchema = z.infer<
  typeof applicationGroupListInputSchema
>;

export const applicationGroupCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(ApplicationGroupType),
  priority: z.number(),
  applications: z.array(idSchema).min(2),
});
export type ApplicationGroupCreateInputSchema = z.infer<
  typeof applicationGroupCreateInputSchema
>;

export const applicationGroupUpdateInputSchema =
  applicationGroupCreateInputSchema.partial().extend({
    id: idSchema,
  });
export type ApplicationGroupUpdateInputSchema = z.infer<
  typeof applicationGroupUpdateInputSchema
>;
