import { Provider } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { ISendmailTransport, TransportBuilder } from '../transports/interfaces/transport.interface';
import { GmailOAuthTransport, SendGridTransport, SMTPTransport } from '../transports';
import { SendmailTransportEnum, SENDMAIL_TRANSPORT } from '../sendmail.constants';

const strategies: Record<string, TransportBuilder> = {
  [SendmailTransportEnum.SENDGRID]: SendGridTransport.build,
  [SendmailTransportEnum.SMTP]: SMTPTransport.build,
  [SendmailTransportEnum.GMAIL_OAUTH]: GmailOAuthTransport.build,
};

export const SendmailTransportProvider: Provider = {
  provide: SENDMAIL_TRANSPORT,
  inject: [ConfigService],

  useFactory: async (config: ConfigService): Promise<ISendmailTransport> => {
    const transportType = config.get<string>('SENDMAIL_TRANSPORT') || SendmailTransportEnum.SMTP;

    const builder = strategies[transportType];
    return await builder(config);
  },
};
