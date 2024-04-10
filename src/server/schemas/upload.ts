import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { listInputSchema } from './list';

export const uploadFormDataSchema = zfd.formData({
  name: zfd.text(),
  file: zfd.file(),
});
export type UploadFormData = z.infer<typeof uploadFormDataSchema>;

export const uploadListInputSchema = listInputSchema
  .extend({
    mimeType: z.string(),
  })
  .partial();
export type UploadListInput = z.infer<typeof uploadListInputSchema>;
