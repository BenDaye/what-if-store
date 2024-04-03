import { PartialBlock } from '@blocknote/core';
import { ApplicationAssetType } from '@prisma/client';
import { z } from 'zod';
import { idSchema } from './id';
import { listInputSchema } from './list';

export const applicationAssetListInputSchema = listInputSchema
  .extend({
    type: z.nativeEnum(ApplicationAssetType).array(),
  })
  .partial();
export type ApplicationAssetListInputSchema = z.infer<
  typeof applicationAssetListInputSchema
>;

export const applicationAssetCreateInputSchema = z
  .object({
    applicationId: idSchema,
    type: z.nativeEnum(ApplicationAssetType),
    url: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    content: z.custom<PartialBlock>().array(),
    isPrimary: z.boolean(),
    isLocal: z.boolean(),
  })
  .partial()
  .required({
    applicationId: true,
    type: true,
    url: true,
  });
export type ApplicationAssetCreateInputSchema = z.infer<
  typeof applicationAssetCreateInputSchema
>;

export const applicationAssetUpdateInputSchema =
  applicationAssetCreateInputSchema.partial().extend({
    id: idSchema,
  });
export type ApplicationAssetUpdateInputSchema = z.infer<
  typeof applicationAssetUpdateInputSchema
>;
