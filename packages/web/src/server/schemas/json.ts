import { Prisma } from '@prisma/client';
import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | Prisma.JsonObject | Prisma.JsonArray;
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
export type JsonSchema = z.infer<typeof jsonSchema>;
