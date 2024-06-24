import { logger } from './logger';

const _logger = logger.child({}, { msgPrefix: '[Task] ' });

const _startup = async (): Promise<string> => Promise.resolve('STARTUP');
const _shutdown = async (): Promise<string> => Promise.resolve('SHUTDOWN');

export const launchStartupTasks = async () => {
  await Promise.allSettled([_startup()])
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
  await Promise.allSettled([_shutdown()])
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
