import { AuthorType } from '@prisma/client';
import { z } from 'zod';
import { listInputSchema } from './list';

export const authorListInputSchema = listInputSchema
  .extend({
    type: z.nativeEnum(AuthorType).array(),
  })
  .partial();
export type AuthorListInputSchema = z.infer<typeof authorListInputSchema>;

export const authorUpdateProfileInputSchema = z
  .object({
    name: z.string(),
    email: z.union([z.string().email(), z.string().nullable()]),
    bio: z.string().nullable(),
    website: z.string().nullable(),
    avatar: z.string().nullable(),
  })
  .partial();
export type AuthorUpdateProfileInputSchema = z.infer<
  typeof authorUpdateProfileInputSchema
>;
