import { ConfigService } from 'src/config';

/**
 * [description]
 */
export interface ISendmailTransportSendOptions {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * [description]
 */
export type TransportBuilder = (
  config: ConfigService,
) => Promise<ISendmailTransport> | ISendmailTransport;

/**
 * [description]
 */
export interface ISendmailTransport {
  /**
   * Method for sending mail
   * @param options
   */
  sendMail(options: ISendmailTransportSendOptions): Promise<unknown>;
}
