import { AuthorType } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const authorListInputSchema = listInputSchema
  .extend({
    type: z.nativeEnum(AuthorType).array(),
  })
  .partial();
export type AuthorListInputSchema = z.infer<typeof authorListInputSchema>;

export const authorCreateProfileInputSchema = z.object({
  type: z.nativeEnum(AuthorType),
  name: z.string(),
  email: z.union([z.string().email(), z.string().nullable()]),
  bio: z.string().nullable(),
  website: z.string().nullable(),
  avatar: z.string().nullable(),
});
export type AuthorCreateProfileInputSchema = z.infer<
  typeof authorCreateProfileInputSchema
>;

export const authorUpdateProfileInputSchema = authorCreateProfileInputSchema
  .omit({ type: true })
  .partial();
export type AuthorUpdateProfileInputSchema = z.infer<
  typeof authorUpdateProfileInputSchema
>;

export const authorUpdateProfileInputSchemaForAdmin =
  authorUpdateProfileInputSchema.extend({
    id: idSchema,
    type: z.nativeEnum(AuthorType).optional(),
    verified: z.boolean().optional(),
  });
export type AuthorUpdateProfileInputSchemaForAdmin = z.infer<
  typeof authorUpdateProfileInputSchemaForAdmin
>;
