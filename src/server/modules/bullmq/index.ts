import { env } from '../env';
import {
  ProviderVerificationQueue,
  ProviderVerificationWorker,
  createProviderVerificationQueue,
  createProviderVerificationWorker,
} from './provider';
import { shutdown, startup } from './utils/task';

const bullmqGlobal = global as typeof global & {
  providerVerificationQueue?: ProviderVerificationQueue;
  providerVerificationWorker?: ProviderVerificationWorker;
};

export const providerVerificationQueue: ProviderVerificationQueue =
  bullmqGlobal.providerVerificationQueue ?? createProviderVerificationQueue();
export const providerVerificationWorker: ProviderVerificationWorker =
  bullmqGlobal.providerVerificationWorker ?? createProviderVerificationWorker();

if (env.NODE_ENV !== 'production') {
  bullmqGlobal.providerVerificationQueue = providerVerificationQueue;
  bullmqGlobal.providerVerificationWorker = providerVerificationWorker;
}

export const startupBullMQ = async (): Promise<string> => {
  await Promise.all([
    startup(providerVerificationQueue, providerVerificationWorker),
  ]);

  return 'BullMQ';
};

export const shutdownBullMQ = async () => {
  await Promise.all([
    shutdown(providerVerificationQueue, providerVerificationWorker),
  ]);

  return 'BullMQ';
};
