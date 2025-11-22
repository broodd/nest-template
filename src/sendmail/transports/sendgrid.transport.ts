import SendGridSdk from '@sendgrid/mail';

import { ConfigService } from 'src/config';

import {
  ISendmailTransportSendOptions,
  ISendmailTransport,
} from './interfaces/transport.interface';

/**
 * [description]
 */
export interface SendGridTransportConfig {
  apiKey: string;
}

/**
 * Fabric method for create SendGrid transport
 */
export class SendGridTransport implements ISendmailTransport {
  /**
   * [description]
   * @param config
   */
  constructor(config: SendGridTransportConfig) {
    SendGridSdk.setApiKey(config.apiKey);
  }

  /**
   * [description]
   * @param config
   */
  static build(config: ConfigService): ISendmailTransport {
    return new SendGridTransport({ apiKey: config.get<string>('SENDGRID_API_KEY') });
  }

  /**
   * Send email using transport
   * @param options
   */
  public async sendMail(options: ISendmailTransportSendOptions) {
    return await SendGridSdk.send(options as SendGridSdk.MailDataRequired);
  }
}
