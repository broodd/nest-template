import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './services';
import { NotificationEntity } from './entities';
import { UsersModule } from '../users';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
