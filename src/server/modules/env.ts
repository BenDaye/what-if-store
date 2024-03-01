import { envSchema } from '../schemas/env';

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('🚫', _env.error.message);
  process.exit(1);
}

export const env = _env.data;
