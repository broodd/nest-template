import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { QueuesStatusEnum } from '../../common/enums';

import { SendMailService } from '../services/sendmail.service';
import { SendMailQueueEventsEnum } from './enums';
import { SENDMAIL_QUEUE } from './constants';
import { MailPayloadType } from '../types';

/**
 * [description]
 */
@Processor(SENDMAIL_QUEUE)
export class SendMailProcessor {
  /**
   * [description]
   * @param sendMailService
   */
  constructor(private readonly sendMailService: SendMailService) {}

  /**
   * [description]
   * @param job
   */
  @Process(SendMailQueueEventsEnum.SEND_MAIL_EVENT)
  public async handleSendMailEvent(job: Job<Partial<MailPayloadType>>): Promise<void> {
    const { status, ...jobData } = job.data;

    if (status == QueuesStatusEnum.PENDING) {
      try {
        await job.update({ status: QueuesStatusEnum.PROCESSING, updatedAt: new Date() });

        await this.sendMailService.sendMail(jobData);

        await job.update({ status: QueuesStatusEnum.COMPLETED, updatedAt: new Date() });
      } catch (error) {
        await job.update({ status: QueuesStatusEnum.FAILED, updatedAt: new Date() });
      }
    }
  }
}
