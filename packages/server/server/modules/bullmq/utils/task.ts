import type { Queue, Worker } from 'bullmq';

export const startup = async (queue: Queue, worker: Worker): Promise<string> => {
  if (await queue.isPaused()) await queue.resume();
  if (!worker.isRunning()) worker.run();
  if (worker.isPaused()) worker.resume();

  return queue.name;
};

export const shutdown = async (queue: Queue, worker: Worker): Promise<string> => {
  if (worker.isRunning()) {
    await worker.pause();
    worker.removeAllListeners();
  }

  await worker.close();

  if (!queue.isPaused()) await queue.pause();
  await queue.close();

  return queue.name;
};
