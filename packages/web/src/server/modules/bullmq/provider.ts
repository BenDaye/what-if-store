import { ProviderVerificationRequestInputSchema } from '@/server/schemas';
import { ProviderVerificationStatus } from '@prisma/client';
import {
  MetricsTime,
  Processor,
  Queue,
  QueueOptions,
  UnrecoverableError,
  Worker,
  WorkerOptions,
} from 'bullmq';
import { prisma } from '../prisma';
import { redis as connection } from '../redis';
import { QUEUE_NAME } from './utils/constants';
import { addQueueListeners, addWorkerListeners } from './utils/listener';

export type ProviderVerificationQueue = Queue<
  ProviderVerificationRequestInputSchema,
  boolean
>;

export type ProviderVerificationWorker = Worker<
  ProviderVerificationRequestInputSchema,
  boolean
>;

export type ProviderVerificationProcessor = Processor<
  ProviderVerificationRequestInputSchema,
  boolean
>;

export const providerVerificationProcessor: ProviderVerificationProcessor =
  async (job) => {
    await prisma.$transaction(async (_prisma) => {
      const providerId = job.name;
      const provider = await _prisma.providerProfile.findUnique({
        where: {
          id: providerId,
        },
      });

      if (!provider) throw new UnrecoverableError('Provider not found');
      if (provider.verified)
        throw new UnrecoverableError('Provider already verified');

      const hasPendingOrApprovedVerification =
        await _prisma.providerVerification.count({
          where: {
            providerId,
            status: {
              in: [
                ProviderVerificationStatus.Pending,
                ProviderVerificationStatus.Approved,
              ],
            },
          },
        });

      if (hasPendingOrApprovedVerification)
        throw new UnrecoverableError(
          'Verification already pending or approved',
        );

      await _prisma.providerVerification.create({
        data: {
          providerId,
          application: job.data.application,
        },
      });
    });

    return true;
  };

export const createProviderVerificationQueue = (
  queueName = QUEUE_NAME.providerVerification,
  opts?: QueueOptions,
): ProviderVerificationQueue => {
  const _queue = new Queue(
    queueName ?? QUEUE_NAME.providerVerification,
    opts ?? {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 1000 * 60 * 60,
          count: 1000,
        },
        removeOnFail: {
          age: 1000 * 60 * 60 * 24 * 3,
        },
      },
    },
  );

  addQueueListeners(_queue);

  return _queue;
};

export const createProviderVerificationWorker = (
  queueName = QUEUE_NAME.providerVerification,
  processor = providerVerificationProcessor,
  opts?: WorkerOptions,
): ProviderVerificationWorker => {
  const _worker = new Worker(
    queueName,
    processor,
    opts ?? {
      connection,
      autorun: false,
      limiter: {
        max: 10,
        duration: 1000,
      },
      metrics: {
        maxDataPoints: MetricsTime.ONE_WEEK * 2,
      },
    },
  );

  addWorkerListeners(_worker);

  return _worker;
};
