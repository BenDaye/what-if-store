import { appLogger } from './pino';

const _logger = appLogger.child({}, { msgPrefix: '[Task] ' });

const startupTasks: PromiseLike<any>[] = [];

export const launchStartupTasks = async () => {
  await Promise.all(startupTasks)
    .then(() => {
      _logger.info('✅ All startup tasks done');
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some startup tasks failed');
    });
};

const shutdownTasks: PromiseLike<any>[] = [];

export const launchShutdownTasks = async () => {
  await Promise.all(shutdownTasks)
    .then(() => {
      _logger.info('✅ All shutdown tasks done');
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some shutdown tasks failed');
    });
};
