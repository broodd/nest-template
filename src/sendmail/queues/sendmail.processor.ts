import { Job } from 'bull';

import { OnQueueFailed, Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { SendMailService } from '../services';
import { MailType } from '../types';

import { SENDMAIL_QUEUE } from './constants';

/**
 * [description]
 */
@Processor(SENDMAIL_QUEUE.name)
export class SendMailProcessor {
  /**
   * [description]
   */
  private readonly logger = new Logger(SendMailService.name);

  /**
   * [description]
   * @param sendMailService
   */
  constructor(private readonly sendMailService: SendMailService) {}

  /**
   * [description]
   * @param job
   */
  // @OnQueueCompleted()
  // onComplete(job: Job) {
  //   this.logger.log(`Completed job #${job.id} of type ${job.name}`, job.data);
  // }

  /**
   * [description]
   * @param job
   * @param error
   */
  @OnQueueFailed()
  onFailure(job: Job, error: any) {
    this.logger.error(`Failed job #${job.id} of type ${job.name}: ${error.message}`, job.data);
  }

  /**
   * [description]
   * @param job
   */
  @Process(SENDMAIL_QUEUE.events.sendMail)
  public async handleSendMailEvent(job: Job<MailType>): Promise<void> {
    await this.sendMailService.sendTemplatedMail(job.data);
  }
}
