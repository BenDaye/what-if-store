import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('The environment to run the server in'),
  NEXT_PUBLIC_APP_PORT: z.coerce.number().int().nonnegative().describe('The port for app to listen on'),
  NEXT_PUBLIC_SERVER_PORT: z.coerce.number().int().nonnegative().describe('The port for serve to listen on'),
  NEXT_PUBLIC_BRIDGE_PORT: z.coerce.number().int().nonnegative().describe('The port for bridge to listen on'),
  NEXT_PUBLIC_STATIC_PORT: z.coerce.number().int().nonnegative().describe('The port for static to listen on'),
  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+(-\S+)?(\+\S+)?$/)
    .default('0.0.0')
    .optional()
    .describe('The version of the app'),
  NEXT_PUBLIC_APP_URL: z.string().url().describe('The url for app to listen on'),
  NEXT_PUBLIC_SERVER_HTTP_URL: z.string().url().describe('The url for server to listen on'),
  NEXT_PUBLIC_SERVER_WS_URL: z.string().url().describe('The url for server to listen on'),
  NEXT_PUBLIC_BRIDGE_HTTP_URL: z.string().url().describe('The url for bridge to listen on'),
  NEXT_PUBLIC_BRIDGE_WS_URL: z.string().url().describe('The url for bridge to listen on'),
  NEXT_PUBLIC_STATIC_HTTP_URL: z.string().url().describe('The url for static to listen on'),
  NEXT_PUBLIC_STATIC_WS_URL: z.string().url().describe('The url for static to listen on'),
  NEXTAUTH_SECRET: z.string().describe('The secret for next-auth'),
  NEXTAUTH_URL: z.string().url().describe('The url for next-auth'),
  NEXTAUTH_URL_INTERNAL: z.string().url().optional().describe('The internal url for next-auth'),
  DATABASE_URL: z.string().url().describe('The url for database to connect to'),
  REDIS_URL: z.string().url().describe('The url for redis to connect to'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('🚫', _env.error.message);
  process.exit(1);
}

export const env = _env.data;
