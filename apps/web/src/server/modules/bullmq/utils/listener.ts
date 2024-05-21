import type { Queue, Worker } from 'bullmq';
import { appLogger } from '../../pino';

const _logger = appLogger.child({}, { msgPrefix: '[BullMQ] ' });

export const addQueueListeners = (queue: Queue) => {
  const msgPrefix = `[${queue.name}] `;
  queue.on('cleaned', (jobs, type) => _logger.child({}, { msgPrefix }).warn({ jobs, type }, 'Queue cleaned'));
  queue.on('error', (error) => _logger.child({}, { msgPrefix }).error({ error }, 'Queue error'));
  queue.on('paused', () => _logger.child({}, { msgPrefix }).debug('Queue paused'));
  queue.on('progress', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job progress'),
  );
  queue.on('removed', (job) => _logger.child({}, { msgPrefix }).debug({ job }, 'Job removed'));
  queue.on('resumed', () => _logger.child({}, { msgPrefix }).debug('Queue resumed'));
  queue.on('waiting', (job) => _logger.child({}, { msgPrefix }).debug({ job }, 'Job waiting'));
};

export const addWorkerListeners = (worker: Worker) => {
  const msgPrefix = `[${worker.name}] `;
  worker.on('active', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job active'),
  );
  worker.on('closed', () => _logger.child({}, { msgPrefix }).warn('Worker closed'));
  worker.on('closing', (msg) => _logger.child({}, { msgPrefix }).warn({ msg }, 'Worker closing'));
  worker.on('completed', (job, result, prev) =>
    _logger.child({}, { msgPrefix }).debug({ result, job, prev }, 'Job completed'),
  );
  worker.on('drained', () => _logger.child({}, { msgPrefix }).warn('Worker drained'));
  worker.on('error', (error) => _logger.child({}, { msgPrefix }).error({ error }, 'Worker error'));
  worker.on('failed', (job, error) => _logger.child({}, { msgPrefix }).error({ error, job }, 'Job failed'));
  worker.on('paused', () => _logger.child({}, { msgPrefix }).warn('Worker paused'));
  worker.on('progress', (job, progress) =>
    _logger.child({}, { msgPrefix }).debug({ progress, job }, 'Job progress'),
  );
  worker.on('ready', () => _logger.child({}, { msgPrefix }).info('Worker ready'));
  worker.on('resumed', () => _logger.child({}, { msgPrefix }).info('Worker resumed'));
  worker.on('stalled', (jobId, prev) =>
    _logger.child({}, { msgPrefix }).debug({ jobId, prev }, 'Job stalled'),
  );
};
