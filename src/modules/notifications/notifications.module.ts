import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsController } from './controllers';
import { NOTIFICATION_QUEUE } from './queues/constants';
import { NotificationsService } from './services';
import { NotiticationsProcessor } from './queues';
import { NotificationEntity } from './entities';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '../users';

/**
 * [description]
 */
export const NotificationsQueueModule = BullModule.registerQueue({
  name: NOTIFICATION_QUEUE,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    forwardRef(() => UsersModule),
    NotificationsQueueModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotiticationsProcessor],
  exports: [NotificationsService, NotificationsQueueModule],
})
export class NotificationsModule {}
