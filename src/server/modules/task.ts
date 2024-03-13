import { shutdownBullMQ, startupBullMQ } from './bullmq';
import { appLogger } from './pino';

const _logger = appLogger.child({}, { msgPrefix: '[Task] ' });

const startupTasks: Promise<string>[] = [startupBullMQ()];

export const launchStartupTasks = async () => {
  await Promise.all(startupTasks)
    .then((result) => {
      result.forEach((task) => _logger.info(`✅ ${task} startup task done`));
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some startup tasks failed');
    });

  await startupBullMQ();
};

const shutdownTasks: Promise<string>[] = [shutdownBullMQ()];

export const launchShutdownTasks = async () => {
  await Promise.all(shutdownTasks)
    .then((result) => {
      result.forEach((task) => _logger.info(`✅ ${task} shutdown task done`));
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some shutdown tasks failed');
    });
};
