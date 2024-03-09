import { ApplicationCategory, ApplicationPlatform } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from '.';
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
  category: z.nativeEnum(ApplicationCategory),
  platforms: z.nativeEnum(ApplicationPlatform).array(),
  countries: z.string().array(),
  ageRating: z.string(),
  description: z.string(),
  website: z.string().url(),
  logo: z.string(),
  screenshots: z.string().array(),
  // FIXME: 验证兼容性
  compatibility: z.any(),
  languages: z.string().array(),
  copyright: z.string(),
  privacyPolicy: z.string(),
  termsOfUse: z.string(),
  github: z.string().url(),
});
export type ApplicationCreateInputSchema = z.infer<
  typeof applicationCreateInputSchema
>;

export const applicationUpdateInputSchema =
  applicationCreateInputSchema.partial();
export type ApplicationUpdateInputSchema = z.infer<
  typeof applicationUpdateInputSchema
>;

export const applicationUpdateInputSchemaForAdmin =
  applicationUpdateInputSchema.extend({
    id: idSchema,
  });
export type ApplicationUpdateInputSchemaForAdmin = z.infer<
  typeof applicationUpdateInputSchemaForAdmin
>;
