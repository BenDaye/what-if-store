import { z } from 'zod';
import { ErrorMessage } from '@what-if-store/utils/error';

export const idSchema = z
  .string({
    required_error: ErrorMessage.REQUIRED,
    invalid_type_error: ErrorMessage.INVALID_TYPE_ERROR,
  })
  .uuid({ message: ErrorMessage.INVALID_ID });
export type IdSchema = z.infer<typeof idSchema>;
