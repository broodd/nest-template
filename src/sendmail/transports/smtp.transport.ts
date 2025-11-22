import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import * as nodemailer from 'nodemailer';

import { ConfigService } from 'src/config';

import {
  ISendmailTransportSendOptions,
  ISendmailTransport,
} from './interfaces/transport.interface';

/**
 * Fabric method for create default SMTP transport
 */
export class SMTPTransport implements ISendmailTransport {
  private transporter: nodemailer.Transporter;

  /**
   * [description]
   * @param options
   */
  constructor(options: TransportType) {
    this.transporter = nodemailer.createTransport(options);
  }

  /**
   * [description]
   * @param config
   */
  static build(config: ConfigService): ISendmailTransport {
    return new SMTPTransport({
      host: config.get<string>('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT'),
      secure: config.get<number>('SMTP_PORT') === 465,
      auth: {
        user: config.get<string>('SMTP_USER'),
        pass: config.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * [description]
   * @param options
   */
  async sendMail(options: ISendmailTransportSendOptions) {
    return await this.transporter.sendMail(options);
  }
}
