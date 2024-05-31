import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { SendMailService } from './services/sendmail.service';
import { SENDMAIL_QUEUE } from './queues/constants';
import { SendMailProcessor } from './queues';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          tls: {
            rejectUnauthorized: true,
          },
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: true,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
          dkim: {
            domainName: config.get('SMTP_DKIM_DOMAIN'),
            keySelector: config.get('SMTP_DKIM_SELECTOR'),
            privateKey: config.get('SMTP_DKIM_SECRET'),
          },
        },
        defaults: {
          from: config.get('SMTP_FROM'),
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: SENDMAIL_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  providers: [SendMailProcessor, SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
