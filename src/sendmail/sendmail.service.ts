import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ResponseMailType, TemplatedMailType } from './types';

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
  public async sendTemplatedEmail<T = TemplatedMailType>(data: T): Promise<ResponseMailType> {
    return this.mailerService.sendMail(data).catch((error) => {
      this.logger.error(error);
      throw new BadGatewayException();
    });
  }
}
