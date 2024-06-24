import { shutdownBullMQ, startupBullMQ } from './bullmq';
import { logger } from './logger';

const _logger = logger.child({}, { msgPrefix: '[Task] ' });

export const launchStartupTasks = async () => {
  await Promise.allSettled([startupBullMQ()])
    .then((result) => {
      result.forEach((task) =>
        task.status === 'fulfilled'
          ? _logger.info(`✅ ${task.value} startup task done`)
          : _logger.error({ err: task.reason }, `❌ startup task failed`),
      );
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some startup tasks failed');
    });
};

export const launchShutdownTasks = async () => {
  await Promise.allSettled([shutdownBullMQ()])
    .then((result) => {
      result.forEach((task) =>
        task.status === 'fulfilled'
          ? _logger.info(`✅ ${task.value} startup task done`)
          : _logger.error({ err: task.reason }, `❌ startup task failed`),
      );
    })
    .catch((err) => {
      _logger.error({ err }, '❌ Some shutdown tasks failed');
    });
};
