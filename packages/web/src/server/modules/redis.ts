import { Redis } from 'ioredis';
import { env } from './env';
import { appLogger } from './pino';

const _logger = appLogger.child({}, { msgPrefix: '[Redis] ' });

const redisGlobal = global as typeof global & {
  redis?: Redis;
};

export const redis: Redis =
  redisGlobal.redis ??
  ((): Redis => {
    const _redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    _redis
      .once('ready', () => {
        _logger.info(
          `Ready for redis://${_redis.options.username}:****@${_redis.options.host}:${_redis.options.port}`,
        );
      })
      .once('close', () => {
        _logger.warn('Close');
      })
      .on('error', (err) => {
        _logger.error({ err }, 'Error');
      });

    return _redis;
  })();

if (env.NODE_ENV !== 'production') {
  redisGlobal.redis = redis;
}

export const redisKeyMap: Record<string, string> = {
  metaAppTitle: 'meta:app:title',
  metaAppDescription: 'meta:app:description',
  metaDashboardTitle: 'meta:dashboard:title',
  metaDashboardDescription: 'meta:dashboard:description',
} as const;
