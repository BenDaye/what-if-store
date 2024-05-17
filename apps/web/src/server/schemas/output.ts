import { z } from 'zod';

export const mutationOutputSchema = z.boolean();
export type MutationOutputSchema = z.infer<typeof mutationOutputSchema>;

export const bullmqJobIdSchema = z.string().optional();
export type BullmqJobIdSchema = z.infer<typeof bullmqJobIdSchema>;
