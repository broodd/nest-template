import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ResponseMailType, MailType } from './types';

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
   * @param mailerService
   */
  constructor(private readonly mailerService: MailerService) {}

  /**
   * [description]
   * @param data
   */
  public async sendTemplatedEmail<T extends MailType>(data: T): Promise<ResponseMailType> {
    if (data.to.length)
      return this.mailerService.sendMail(data).catch((error) => {
        this.logger.error(error);
        throw new BadGatewayException();
      });
  }
}
