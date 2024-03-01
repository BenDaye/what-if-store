import { z } from 'zod';
import { CommonMessage } from '../utils/message';
import { idSchema } from './id';
import { CommonRegex } from '../utils/regex';

export const tokenStringSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .length(6, { message: CommonMessage.INVALID_TOKEN_LENGTH });
export type TokenStringSchema = z.infer<typeof tokenSchema>;

export const tokenSchema = z.object({
  token: tokenStringSchema,
});
export type TokenSchema = z.infer<typeof tokenSchema>;

export const usernameSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .regex(CommonRegex.USERNAME, {
    message: CommonMessage.INVALID_USERNAME,
  });
export type UsernameSchema = z.infer<typeof usernameSchema>;

export const passwordSchema = z
  .string({ required_error: CommonMessage.REQUIRED })
  .regex(CommonRegex.PASSWORD, {
    message: CommonMessage.INVALID_PASSWORD,
  });
export type PasswordSchema = z.infer<typeof passwordSchema>;

export const signUpSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = signUpSchema.extend({});
export type SignInSchema = z.infer<typeof signInSchema>;

export const bindTokenSchema = tokenSchema.extend({
  secret: z.string({ required_error: CommonMessage.REQUIRED }),
});
export type BindTokenSchema = z.infer<typeof bindTokenSchema>;

export const unbindTokenSchema = z.object({
  id: idSchema,
});
export type UnbindTokenSchema = z.infer<typeof unbindTokenSchema>;

export const forgotPasswordSchema = z.object({
  username: usernameSchema,
  newPassword: passwordSchema,
  token: tokenStringSchema,
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  newPassword: passwordSchema,
  token: tokenSchema.optional(),
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
