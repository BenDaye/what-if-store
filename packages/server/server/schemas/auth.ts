import { z } from 'zod';
import { ErrorMessage } from '@what-if-store/utils/error';
import { CommonRegex } from '@what-if-store/utils/regex';
import { idSchema } from './id';

export const tokenStringSchema = z
  .string({ required_error: ErrorMessage.REQUIRED })
  .length(6, { message: ErrorMessage.INVALID_TOKEN_LENGTH });
export type TokenStringSchema = z.infer<typeof tokenSchema>;

export const tokenSchema = z.object({
  token: tokenStringSchema,
});
export type TokenSchema = z.infer<typeof tokenSchema>;

export const usernameSchema = z
  .string({ required_error: ErrorMessage.REQUIRED })
  .regex(CommonRegex.USERNAME, {
    message: ErrorMessage.INVALID_USERNAME,
  });
export type UsernameSchema = z.infer<typeof usernameSchema>;

export const passwordSchema = z
  .string({ required_error: ErrorMessage.REQUIRED })
  .regex(CommonRegex.PASSWORD, {
    message: ErrorMessage.INVALID_PASSWORD,
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
  secret: z.string({ required_error: ErrorMessage.REQUIRED }),
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
