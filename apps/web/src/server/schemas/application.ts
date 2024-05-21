import { ApplicationCategory, ApplicationPlatform, ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';
import { priceSchema } from './price';

export const applicationListInputSchema = listInputSchema
  .extend({
    category: z.nativeEnum(ApplicationCategory).array(),
    platforms: z.nativeEnum(ApplicationPlatform).array(),
    locales: z.string().array(),
    status: z.nativeEnum(ApplicationStatus).array(),
    countries: z.string().array(),
    ageRating: z.string().regex(/^\d+\+$/),
  })
  .partial();
export type ApplicationListInputSchema = z.infer<typeof applicationListInputSchema>;

export const applicationCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(ApplicationCategory),
  price: priceSchema.array().min(1),

  platforms: z.nativeEnum(ApplicationPlatform).array().min(1),
  compatibility: z
    .object({
      platform: z.nativeEnum(ApplicationPlatform),
      requirement: z.string(),
    })
    .array(),
  ageRating: z.string().regex(/^\d+\+$/),
  countries: z.string().array().min(1),
  locales: z.string().array().min(1),
  website: z.string().url(),
  github: z.string().url(),

  tags: z.object({ id: idSchema }).array(),
});
export type ApplicationCreateInputSchema = z.infer<typeof applicationCreateInputSchema>;

export const applicationUpdateInputSchema = applicationCreateInputSchema.partial().extend({
  id: idSchema,
});
export type ApplicationUpdateInputSchema = z.infer<typeof applicationUpdateInputSchema>;

export const applicationChangeStatusInputSchema = z.object({
  id: idSchema,
  status: z.nativeEnum(ApplicationStatus),
  request: z.string().nullable().optional(),
  response: z.string().nullable().optional(),
});
export type ApplicationChangeStatusInputSchema = z.infer<typeof applicationChangeStatusInputSchema>;
