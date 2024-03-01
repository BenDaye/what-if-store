import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('The environment to run the server in'),
  APP_PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .describe('The port for app to listen on'),
  WS_PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .describe('The port for websocket to listen on'),
  SERVER_PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .describe('The port for serve to listen on'),
  NEXTAUTH_SECRET: z.string().describe('The secret for next-auth'),
  NEXTAUTH_URL: z.string().url().describe('The url for next-auth'),
  NEXTAUTH_URL_INTERNAL: z
    .string()
    .url()
    .optional()
    .describe('The internal url for next-auth'),
  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+(-\S+)?(\+\S+)?$/)
    .default('0.0.0')
    .optional()
    .describe('The version of the app'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .describe('The url for app to listen on'),
  NEXT_PUBLIC_WS_URL: z
    .string()
    .url()
    .describe('The url for websocket to listen on'),
  NEXT_PUBLIC_SERVER_URL: z
    .string()
    .url()
    .describe('The url for serve to listen on'),
  DATABASE_URL: z.string().url().describe('The url for database to connect to'),
  REDIS_URL: z.string().url().describe('The url for redis to connect to'),
});
