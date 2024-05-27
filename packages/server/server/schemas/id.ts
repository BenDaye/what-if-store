import { z } from 'zod';
import { CommonMessage } from '../utils/message';

export const idSchema = z
  .string({
    required_error: CommonMessage.REQUIRED,
    invalid_type_error: CommonMessage.INVALID_TYPE_ERROR,
  })
  .uuid({ message: CommonMessage.INVALID_ID });
export type IdSchema = z.infer<typeof idSchema>;
