import { ProviderType, ProviderVerificationStatus } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const providerListInputSchema = listInputSchema
  .extend({
    type: z.nativeEnum(ProviderType).array(),
  })
  .partial();
export type ProviderListInputSchema = z.infer<typeof providerListInputSchema>;

export const providerCreateProfileInputSchema = z.object({
  type: z.nativeEnum(ProviderType),
  name: z.string(),
  email: z.union([z.string().email(), z.string().nullable()]),
  bio: z.string().nullable(),
  website: z.string().nullable(),
  avatar: z.string().nullable(),
});
export type ProviderCreateProfileInputSchema = z.infer<
  typeof providerCreateProfileInputSchema
>;

export const providerUpdateProfileInputSchema = providerCreateProfileInputSchema
  .omit({ type: true })
  .partial();
export type ProviderUpdateProfileInputSchema = z.infer<
  typeof providerUpdateProfileInputSchema
>;

export const providerUpdateProfileInputSchemaForAdmin =
  providerUpdateProfileInputSchema.extend({
    id: idSchema,
    type: z.nativeEnum(ProviderType).optional(),
  });
export type ProviderUpdateProfileInputSchemaForAdmin = z.infer<
  typeof providerUpdateProfileInputSchemaForAdmin
>;

export const providerVerificationRequestInputSchema = z.object({
  application: z.string().nullable(),
});
export type ProviderVerificationRequestInputSchema = z.infer<
  typeof providerVerificationRequestInputSchema
>;

export const providerVerificationResponseInputSchema = z.object({
  status: z.nativeEnum(ProviderVerificationStatus),
  replication: z.string().nullable(),
  id: idSchema,
});
export type ProviderVerificationResponseInputSchema = z.infer<
  typeof providerVerificationResponseInputSchema
>;
