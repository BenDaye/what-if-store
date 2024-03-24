import {
  ApplicationCategory,
  ApplicationPlatform,
  ApplicationStatus,
} from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { jsonSchema } from './json';
import { listInputSchema } from './list';

export const applicationListInputSchema = listInputSchema
  .extend({
    category: z.nativeEnum(ApplicationCategory).array(),
    platform: z.nativeEnum(ApplicationPlatform),
    language: z.string(),
  })
  .partial();
export type ApplicationListInputSchema = z.infer<
  typeof applicationListInputSchema
>;

export const applicationCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(ApplicationCategory),
  price: z.number().nonnegative(),

  platforms: z.nativeEnum(ApplicationPlatform).array().min(1),
  compatibility: jsonSchema,
  ageRating: z.string().regex(/^\d+\+$/),
  countries: z.string().array().min(1),
  locales: z.string().array().min(1),
  website: z.string().url(),
  github: z.string().url(),

  tags: z.object({ id: idSchema }).array(),
});
export type ApplicationCreateInputSchema = z.infer<
  typeof applicationCreateInputSchema
>;

export const applicationUpdateInputSchema = applicationCreateInputSchema
  .partial()
  .extend({
    id: idSchema,
  });
export type ApplicationUpdateInputSchema = z.infer<
  typeof applicationUpdateInputSchema
>;

export const applicationChangeStatusInputSchema = z.object({
  id: idSchema,
  status: z.nativeEnum(ApplicationStatus),
  request: z.string().nullable().optional(),
  response: z.string().nullable().optional(),
});
export type ApplicationChangeStatusInputSchema = z.infer<
  typeof applicationChangeStatusInputSchema
>;
