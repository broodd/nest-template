import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';

import { ErrorTypeEnum, QueuesStatusEnum } from '../../common/enums';

import { MailPayloadType, ResponseMailType } from '../types';
import { SendMailQueueEventsEnum } from '../queues/enums';
import { SENDMAIL_QUEUE } from '../queues/constants';

/**
 * [description]
 */
@Injectable()
export class SendMailService {
  /**
   * [description]
   */
  private readonly logger = new Logger(SendMailService.name);

  /**
   * [description]
   * @param sendMailQueue
   * @param mailerService
   */
  constructor(
    @InjectQueue(SENDMAIL_QUEUE)
    private readonly sendMailQueue: Queue,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * [description]
   * @param data
   */
  public async sendMail<T extends Partial<MailPayloadType>>(data: T): Promise<ResponseMailType> {
    return this.mailerService.sendMail(data).catch((error) => {
      this.logger.error(error);
      throw new BadGatewayException(ErrorTypeEnum.ERROR_WITH_EMAIL_SENDING);
    });
  }

  /**
   * [description]
   * @param data
   * @param options
   */
  public async createSendMailJobEvent<T extends MailPayloadType>(
    data: T,
    options: Bull.JobOptions = { delay: 1000, timeout: 10000 },
  ): Promise<void | Bull.Job<T>> {
    return this.sendMailQueue
      .add(
        SendMailQueueEventsEnum.SEND_MAIL_EVENT,
        { status: QueuesStatusEnum.PENDING, createdAt: new Date(), updatedAt: new Date(), ...data },
        options,
      )
      .catch((error) => this.logger.error(error));
  }
}
