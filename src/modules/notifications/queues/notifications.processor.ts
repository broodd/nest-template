import { Process, Processor } from '@nestjs/bull';
import { FindOptionsWhere } from 'typeorm';
import { Job } from 'bull';

import { UserNotificationTokenEntity } from 'src/modules/users/entities';

import { NotificationsQueueEventsEnum } from './enums';
import { NotificationsService } from '../services';
import { NOTIFICATION_QUEUE } from './constants';
import { NotificationEntity } from '../entities';

/**
 * [description]
 */
@Processor(NOTIFICATION_QUEUE)
export class NotiticationsProcessor {
  /**
   * [description]
   * @param notificationsService
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * [description]
   * @param job
   */
  @Process(NotificationsQueueEventsEnum.REMINDER)
  public async handleCreateReminderEvent(
    job: Job<{
      conditions: FindOptionsWhere<UserNotificationTokenEntity>;
      data: Partial<NotificationEntity>;
    }>,
  ): Promise<void> {
    await this.notificationsService.sendAndCreateOneForOne(job.data.conditions, job.data.data);
  }
}
