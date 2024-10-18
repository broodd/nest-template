import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { SendMailService } from './sendmail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          tls: { rejectUnauthorized: true },
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
          adapter: new HandlebarsAdapter({
            ifNotEquals: function (arg1, arg2, options) {
              return arg1 != arg2 ? options.fn(this) : options.inverse(this);
            },
            ifEquals: function (arg1, arg2, options) {
              return arg1 == arg2 ? options.fn(this) : options.inverse(this);
            },
            parse: function (text) {
              const template = Handlebars.compile(text);
              return new Handlebars.SafeString(template(this));
            },
          }),
          options: { strict: true },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
