import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('The environment to run the server in'),
  BRIDGE_PORT: z.coerce.number().int().nonnegative().describe('The port for bridge to listen on'),
  NEXT_PUBLIC_BRIDGE_URL: z.string().url().describe('The url for websocket to listen on'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('🚫', _env.error.message);
  process.exit(1);
}

export const env = _env.data;
