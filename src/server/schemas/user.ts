import { AuthRole } from '@prisma/client';
import { z } from 'zod';
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
  })
  .partial();
export type UserUpdateProfileInputSchema = z.infer<
  typeof userUpdateProfileInputSchema
>;
