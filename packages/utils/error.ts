import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export type HandleServerErrorOptions = {
  showPrismaError?: boolean;
};

const DEFAULT_HANDLE_SERVER_ERROR_OPTIONS: HandleServerErrorOptions = {
  showPrismaError: process.env.NODE_ENV === 'development',
} as const;

export const handleServerError = (
  err: unknown,
  { showPrismaError }: HandleServerErrorOptions = DEFAULT_HANDLE_SERVER_ERROR_OPTIONS,
): TRPCError => {
  if (err instanceof Prisma.PrismaClientKnownRequestError)
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: showPrismaError ? err.message : 'BAD_REQUEST',
      cause: err,
    });
  if (err instanceof Prisma.PrismaClientUnknownRequestError)
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: showPrismaError ? err.message : 'BAD_REQUEST',
      cause: err,
    });

  if (err instanceof Prisma.PrismaClientValidationError)
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: showPrismaError ? err.message : 'BAD_REQUEST',
      cause: err,
    });

  if (err instanceof TRPCError) return err;

  if (err instanceof Error)
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: showPrismaError ? err.message : 'INTERNAL_SERVER_ERROR',
      cause: err,
    });

  if (typeof err === 'string')
    return new TRPCError({
      code: 'UNPROCESSABLE_CONTENT',
      message: showPrismaError ? err : 'UNPROCESSABLE_CONTENT',
      cause: err,
    });

  return new TRPCError({
    code: 'UNPROCESSABLE_CONTENT',
    message: 'Unprocessable content',
    cause: err,
  });
};

export const ErrorMessageKey = {
  REQUIRED: 'REQUIRED',
  INVALID_ID: 'INVALID_ID',
  INVALID_TYPE_ERROR: 'INVALID_TYPE_ERROR',
  INVALID_USERNAME: 'INVALID_USERNAME',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_TOKEN_LENGTH: 'INVALID_TOKEN_LENGTH',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_COLOR_STRING: 'INVALID_COLOR_STRING',
} as const;

export type ErrorMessageType = keyof typeof ErrorMessageKey;

export const ErrorMessage: Record<ErrorMessageType, string> = {
  REQUIRED: '必填',
  INVALID_ID: '无效ID',
  INVALID_TYPE_ERROR: '无效类型',
  INVALID_USERNAME: '无效用户名, 长度在8到32个字符之间, 可包含大小写英文字母, 数字, 下划线。',
  INVALID_PASSWORD:
    '无效密码, 长度在8到32个字符之间, 并且包含至少一个数字、一个大写字母、一个小写字母和一个特殊字符 ( - _ ! @ # $ % ^ & * ? )',
  INVALID_TOKEN_LENGTH: '无效验证码长度, 请输入6位验证码',
  INVALID_ADDRESS: '无效的地址',
  INVALID_COLOR_STRING: '无效的颜色字符串',
} as const;
