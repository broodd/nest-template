import { CronRepeatOptions, QueueOptions, JobOptions, JobId } from 'bull';

/**
 * [description]
 */

export interface RepeatJobOptions {
  readonly repeat?:
    | (CronRepeatOptions & {
        key?: string;
        jobId?: JobId | undefined;
      })
    | undefined;
}

/**
 * [description]
 */
export interface QueueEventConfigType {
  name: string;
  options?: JobOptions & RepeatJobOptions;
  data?: Record<string, unknown>;
  generateJobId?: (...args: any) => string;
}

/**
 * [description]
 */
export type QueueConfigType = {
  name: string;
  defaultJobOptions?: QueueOptions['defaultJobOptions'];
  events?: Record<string, QueueEventConfigType>;
};
