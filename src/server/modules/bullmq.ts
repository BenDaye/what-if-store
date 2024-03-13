import { ProviderVerificationStatus } from '@prisma/client';
import { Processor, Queue, UnrecoverableError, Worker } from 'bullmq';
import { ProviderVerificationRequestInputSchema } from '../schemas';
import { env } from './env';
import { appLogger } from './pino';
import { prisma } from './prisma';
import { redis as connection } from './redis';

const _logger = appLogger.child({}, { msgPrefix: '[BullMQ] ' });

const bullmqNameMap = {
  providerVerification: 'provider.verification',
} as const;

const addQueueListeners = (queue: Queue) => {
  const msgPrefix = `[${queue.name}] `;
  queue.on('cleaned', (jobs, type) =>
    _logger.child({}, { msgPrefix }).warn({ jobs, type }, 'Queue cleaned'),
  );
  queue.on('error', (error) =>
    _logger.child({}, { msgPrefix }).error({ error }, 'Queue error'),
  );
  queue.on('paused', () =>
    _logger.child({}, { msgPrefix }).debug('Queue paused'),
  );
  queue.on('progress', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job progress'),
  );
  queue.on('removed', (job) =>
    _logger.child({}, { msgPrefix }).debug({ job }, 'Job removed'),
  );
  queue.on('resumed', () =>
    _logger.child({}, { msgPrefix }).debug('Queue resumed'),
  );
  queue.on('waiting', (job) =>
    _logger.child({}, { msgPrefix }).debug({ job }, 'Job waiting'),
  );
};

const addWorkerListeners = (worker: Worker) => {
  const msgPrefix = `[${worker.name}] `;
  worker.on('active', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job active'),
  );
  worker.on('closed', () =>
    _logger.child({}, { msgPrefix }).warn('Worker closed'),
  );
  worker.on('closing', (msg) =>
    _logger.child({}, { msgPrefix }).warn({ msg }, 'Worker closing'),
  );
  worker.on('completed', (job, result, prev) =>
    _logger
      .child({}, { msgPrefix })
      .debug({ result, job, prev }, 'Job completed'),
  );
  worker.on('drained', () =>
    _logger.child({}, { msgPrefix }).warn('Worker drained'),
  );
  worker.on('error', (error) =>
    _logger.child({}, { msgPrefix }).error({ error }, 'Worker error'),
  );
  worker.on('failed', (job, error) =>
    _logger.child({}, { msgPrefix }).error({ error, job }, 'Job failed'),
  );
  worker.on('paused', () =>
    _logger.child({}, { msgPrefix }).warn('Worker paused'),
  );
  worker.on('progress', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job progress'),
  );
  worker.on('ready', () =>
    _logger.child({}, { msgPrefix }).info('Worker ready'),
  );
  worker.on('resumed', () =>
    _logger.child({}, { msgPrefix }).info('Worker resumed'),
  );
  worker.on('stalled', (jobId, prev) =>
    _logger.child({}, { msgPrefix }).debug({ jobId, prev }, 'Job stalled'),
  );
};

const bullmqGlobal = global as typeof global & {
  providerVerificationQueue?: Queue<
    ProviderVerificationRequestInputSchema,
    boolean
  >;
  providerVerificationWorker?: Worker<
    ProviderVerificationRequestInputSchema,
    boolean
  >;
};

const providerVerificationProcessor: Processor<
  ProviderVerificationRequestInputSchema,
  boolean
> = async (job) => {
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
      throw new UnrecoverableError('Verification already pending or approved');

    await _prisma.providerVerification.create({
      data: {
        providerId,
        application: job.data.application,
      },
    });
  });

  return true;
};

export const providerVerificationQueue: Queue<
  ProviderVerificationRequestInputSchema,
  boolean
> =
  bullmqGlobal.providerVerificationQueue ??
  (() => {
    const _queue = new Queue(bullmqNameMap.providerVerification, {
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
    });

    addQueueListeners(_queue);

    return _queue;
  })();
export const providerVerificationWorker: Worker<
  ProviderVerificationRequestInputSchema,
  boolean
> =
  bullmqGlobal.providerVerificationWorker ??
  (() => {
    const _worker = new Worker(
      bullmqNameMap.providerVerification,
      providerVerificationProcessor,
      {
        connection,
        autorun: false,
        limiter: {
          max: 10,
          duration: 1000,
        },
      },
    );

    addWorkerListeners(_worker);

    return _worker;
  })();

if (env.NODE_ENV !== 'production') {
  bullmqGlobal.providerVerificationQueue = providerVerificationQueue;
  bullmqGlobal.providerVerificationWorker = providerVerificationWorker;
}

export const startupBullMQ = async (): Promise<string> => {
  if (await providerVerificationQueue.isPaused())
    await providerVerificationQueue.resume();
  if (!providerVerificationWorker.isRunning()) providerVerificationWorker.run();
  if (providerVerificationWorker.isPaused())
    providerVerificationWorker.resume();

  return 'BullMQ';
};

export const shutdownBullMQ = async () => {
  if (providerVerificationWorker.isRunning()) {
    await providerVerificationWorker.pause();
    providerVerificationWorker.removeAllListeners();
  }

  await providerVerificationWorker.close();

  if (!providerVerificationQueue.isPaused())
    await providerVerificationQueue.pause();
  await providerVerificationQueue.close();

  return 'BullMQ';
};
