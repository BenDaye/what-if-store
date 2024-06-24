import { env } from '../env';
import { logger } from '../logger';
import type { ApplicationChangeStatusQueue, ApplicationChangeStatusWorker } from './application';
import { createApplicationChangeStatusQueue, createApplicationChangeStatusWorker } from './application';
import type { ProviderVerificationQueue, ProviderVerificationWorker } from './provider';
import { createProviderVerificationQueue, createProviderVerificationWorker } from './provider';
import { shutdown, startup } from './utils/task';

const _logger = logger.child({}, { msgPrefix: '[BullMQ] ' });

const bullmqGlobal = global as typeof global & {
  providerVerificationQueue?: ProviderVerificationQueue;
  providerVerificationWorker?: ProviderVerificationWorker;

  applicationChangeStatusQueue?: ApplicationChangeStatusQueue;
  applicationChangeStatusWorker?: ApplicationChangeStatusWorker;
};

export const providerVerificationQueue: ProviderVerificationQueue =
  bullmqGlobal.providerVerificationQueue ?? createProviderVerificationQueue();
export const providerVerificationWorker: ProviderVerificationWorker =
  bullmqGlobal.providerVerificationWorker ?? createProviderVerificationWorker();

export const applicationChangeStatusQueue: ApplicationChangeStatusQueue =
  bullmqGlobal.applicationChangeStatusQueue ?? createApplicationChangeStatusQueue();
export const applicationChangeStatusWorker: ApplicationChangeStatusWorker =
  bullmqGlobal.applicationChangeStatusWorker ?? createApplicationChangeStatusWorker();

if (env.NODE_ENV !== 'production') {
  bullmqGlobal.providerVerificationQueue = providerVerificationQueue;
  bullmqGlobal.providerVerificationWorker = providerVerificationWorker;

  bullmqGlobal.applicationChangeStatusQueue = applicationChangeStatusQueue;
  bullmqGlobal.applicationChangeStatusWorker = applicationChangeStatusWorker;
}

export const startupBullMQ = async () => {
  await Promise.allSettled([
    startup(providerVerificationQueue, providerVerificationWorker),
    startup(applicationChangeStatusQueue, applicationChangeStatusWorker),
  ]).then((result) => {
    result.forEach((task) =>
      task.status === 'fulfilled'
        ? _logger.info({ queue: task.value }, `✅ startup task done`)
        : _logger.error({ err: task.reason }, `❌ startup task failed`),
    );
  });
  return 'BullMQ';
};

export const shutdownBullMQ = async () => {
  await Promise.allSettled([
    shutdown(providerVerificationQueue, providerVerificationWorker),
    shutdown(applicationChangeStatusQueue, applicationChangeStatusWorker),
  ]).then((result) => {
    result.forEach((task) =>
      task.status === 'fulfilled'
        ? _logger.info({ queue: task.value }, `✅ shutdown task done`)
        : _logger.error({ err: task.reason }, `❌ shutdown task failed`),
    );
  });
  return 'BullMQ';
};
