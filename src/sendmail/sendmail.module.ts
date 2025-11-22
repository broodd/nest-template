import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { DEFAULT_QUEUE_CONFIG } from 'src/common/queues/constants';

import { ConfigModule } from 'src/config';

import { UsersModule } from 'src/modules/users';

import {
  SendmailTemplateContextFactory,
  SendmailTransportProvider,
  SendMailService,
} from './services';
import { registerHandlebarsHelpers } from './handlebars-helpers';
import { SendmailTemplatesController } from './controllers';
import { SENDMAIL_QUEUE } from './queues/constants';
import { SendMailProcessor } from './queues';

/**
 * [description]
 */
export const SendMailQueueModule = BullModule.registerQueue({
  defaultJobOptions: DEFAULT_QUEUE_CONFIG,
  name: SENDMAIL_QUEUE.name,
  limiter: {
    max: 1, // max 1 job per operation
    duration: 2000, // interval 2 seconds
  },
});

/**
 * Setup Handlebars heplers
 */
registerHandlebarsHelpers();

/**
 * [description]
 */
@Module({
  imports: [ConfigModule, UsersModule, SendMailQueueModule],
  controllers: [SendmailTemplatesController],
  providers: [
    SendmailTransportProvider,

    SendmailTemplateContextFactory,
    SendMailService,
    SendMailProcessor,
  ],
  exports: [SendMailService, SendmailTemplateContextFactory, SendMailQueueModule],
})
export class SendMailModule {}
