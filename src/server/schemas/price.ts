import { z } from 'zod';

export const priceSchema = z.object({
  price: z.number().int().nonnegative(),
  country: z.string(),
  currency: z.string(),
  startedAt: z.date().optional(),
});
export type PriceSchema = z.infer<typeof priceSchema>;
