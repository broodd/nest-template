import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

import { ConfigService } from 'src/config';

import {
  ISendmailTransportSendOptions,
  ISendmailTransport,
} from './interfaces/transport.interface';

/**
 * [description]
 */
export interface GmailOAuthTransportOptions {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  user: string;
}

/**
 * Fabric method for create Gmail OAuth transport
 */
export class GmailOAuthTransport implements ISendmailTransport {
  private transporter: nodemailer.Transporter;

  /**
   * [description]
   * @param options
   */
  constructor(options: TransportType) {
    this.transporter = nodemailer.createTransport(options);
  }

  /**
   * Init auth tokens
   */
  static async init(options: GmailOAuthTransportOptions): Promise<TransportType> {
    const { clientId, clientSecret, refreshToken, user } = options;

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = (await oAuth2Client.getAccessToken()).token;

    return {
      port: 465,
      secure: true,
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    };
  }

  /**
   * [description]
   * @param config
   */
  static async build(config: ConfigService): Promise<ISendmailTransport> {
    const transportConfg = await GmailOAuthTransport.init({
      clientId: config.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: config.get<string>('GOOGLE_OAUTH_REFRESH_TOKEN'),
      user: config.get<string>('GOOGLE_OAUTH_USER'),
    });
    return new GmailOAuthTransport(transportConfg);
  }

  /**
   * Send email using transport
   * @param options
   */
  public async sendMail(options: ISendmailTransportSendOptions) {
    return await this.transporter.sendMail(options);
  }
}
