import {
  ApplicationCategory,
  ApplicationPlatform,
  ApplicationStatus,
} from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
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

export const applicationCreateInputSchema = z
  .object({
    name: z.string(),
    category: z.nativeEnum(ApplicationCategory),
    platforms: z.nativeEnum(ApplicationPlatform).array(),
    countries: z.string().array(),
    ageRating: z.string(),
    price: z.number().nonnegative(),
    // NOTE: Information
    description: z.string(),
    website: z.string().url(),
    logo: z.string(),
    screenshots: z.string().array(),
    // TODO: It should be checked if the structure is correct
    compatibility: z.any(),
    languages: z.string().array(),
    copyright: z.string(),
    privacyPolicy: z.string(),
    termsOfUse: z.string(),
    github: z.string().url(),
    // NOTE: Version History
    version: z.string().regex(/^(\d+\.)?(\d+\.)?(\*|\d+)$/),
    releaseDate: z.coerce.date(),
    changelog: z.string().nullable(),
    latest: z.boolean(),
    deprecated: z.boolean(),
    preview: z.boolean(),
    // NOTE: Tag
    tags: z.array(idSchema),
  })
  .partial({
    version: true,
    releaseDate: true,
    changelog: true,
    latest: true,
    deprecated: true,
    preview: true,
    tags: true,
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

export const applicationReviewInputSchema = z.object({
  id: idSchema,
  status: z.nativeEnum(ApplicationStatus),
});
export type ApplicationReviewInputSchema = z.infer<
  typeof applicationReviewInputSchema
>;
