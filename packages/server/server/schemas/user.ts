import { z } from 'zod';
import { AuthRole } from '@what-if-store/prisma/client';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const userListInputSchema = listInputSchema
  .extend({
    role: z.nativeEnum(AuthRole).array(),
  })
  .partial();
export type UserListInputSchema = z.infer<typeof userListInputSchema>;

export const userUpdateProfileInputSchema = z
  .object({
    nickname: z.string().nullable(),
    email: z.union([z.string().email(), z.string().nullable()]),
    avatar: z.string().nullable(),
    bio: z.string().nullable(),
    country: z.string().nullable(),
  })
  .partial();
export type UserUpdateProfileInputSchema = z.infer<typeof userUpdateProfileInputSchema>;

export const userUpdateProfileInputSchemaForAdmin = userUpdateProfileInputSchema.extend({
  id: idSchema,
  role: z.nativeEnum(AuthRole).optional(),
});
export type UserUpdateProfileInputSchemaForAdmin = z.infer<typeof userUpdateProfileInputSchemaForAdmin>;
