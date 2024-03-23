import { validStatusTransition } from '@/utils/validApplicationStatusTransition';
import { ApplicationStatus, AuthRole } from '@prisma/client';
import {
  DelayedError,
  MetricsTime,
  Processor,
  Queue,
  QueueOptions,
  UnrecoverableError,
  Worker,
  WorkerOptions,
} from 'bullmq';
import { z } from 'zod';
import { applicationChangeStatusInputSchema, idSchema } from '../../schemas';
import { applicationEmitter } from '../mitt';
import { prisma } from '../prisma';
import { redis as connection } from '../redis';
import { QUEUE_NAME } from './utils/constants';
import { addQueueListeners, addWorkerListeners } from './utils/listener';

const applicationChangeStatusJobDataType =
  applicationChangeStatusInputSchema.extend({
    userId: idSchema,
    reviewerId: idSchema.optional(),
  });
type ApplicationChangeStatusJobDataType = z.infer<
  typeof applicationChangeStatusJobDataType
>;

export type ApplicationChangeStatusQueue = Queue<
  ApplicationChangeStatusJobDataType,
  ApplicationStatus
>;

export type ApplicationChangeStatusWorker = Worker<
  ApplicationChangeStatusJobDataType,
  ApplicationStatus
>;

export type ApplicationChangeStatusProcessor = Processor<
  ApplicationChangeStatusJobDataType,
  ApplicationStatus
>;

export const applicationChangeStatusProcessor: ApplicationChangeStatusProcessor =
  async (job, token) => {
    const {
      id: applicationId,
      userId: applicantId,
      reviewerId,
      status: nextStatus,
    } = job.data;

    return await prisma.$transaction(
      async (_prisma): Promise<ApplicationStatus> => {
        const application = await _prisma.application.findUnique({
          where: {
            id: applicationId,
          },
        });
        if (!application) throw new UnrecoverableError('Application not found');
        const currentStatus = application.status;

        const applicant = await _prisma.user.findUnique({
          where: {
            id: applicantId,
          },
        });
        if (!applicant) throw new UnrecoverableError('Applicant not found');
        const [isValidStatusTransition, isReviewRequired] =
          validStatusTransition(currentStatus, nextStatus, applicant.role);
        if (!isValidStatusTransition)
          throw new UnrecoverableError('Invalid status transition');

        if (applicant.role === AuthRole.Provider) {
          if (application.providerId !== applicantId)
            throw new UnrecoverableError('Invalid applicant');

          if (isReviewRequired) {
            const isWaitingForReview = typeof reviewerId === 'undefined';
            if (isWaitingForReview) {
              // NOTE: https://docs.bullmq.io/patterns/process-step-jobs
              await job.moveToDelayed(Date.now() + 1000 * 60 * 5, token);
              await job.updateData({
                ...job.data,
                response: `Waiting for review.\nLast updated at ${new Date().valueOf()}`,
              });
              throw new DelayedError('Waiting for review');
            }

            const reviewer = await _prisma.user.findUnique({
              where: {
                id: reviewerId,
              },
            });
            if (!reviewer) throw new UnrecoverableError('Reviewer not found');
            if (reviewer.role !== AuthRole.Admin)
              throw new UnrecoverableError('Invalid reviewer role');
          }
        }

        if (applicant.role === AuthRole.Admin) {
          // if (isReviewRequired) {
          //   // TODO: Maybe admin should check "isReviewRequired" too.
          // }
          await job.updateData({ ...job.data, reviewerId: applicantId });
        }

        // TODO: DO some stuff before change status, e.g. force to cancel unfinished job or something.

        await _prisma.application.update({
          where: {
            id: applicationId,
          },
          data: {
            status: nextStatus,
          },
        });
        applicationEmitter.emit('update', applicationId);
        return nextStatus;
      },
    );
  };

export const createApplicationChangeStatusQueue = (
  queueName = QUEUE_NAME.applicationChangeStatus,
  opts?: QueueOptions,
): ApplicationChangeStatusQueue => {
  const _queue = new Queue(
    queueName,
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

export const createApplicationChangeStatusWorker = (
  queueName = QUEUE_NAME.applicationChangeStatus,
  processor = applicationChangeStatusProcessor,
  opts?: WorkerOptions,
): ApplicationChangeStatusWorker => {
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
