import { FindOptionsWhere } from 'typeorm';
import { Job } from 'bull';

import { Processor, Process } from '@nestjs/bull';

import { UserNotificationTokenEntity } from 'src/modules/users/entities';

import { NotificationsService } from '../services';
import { NotificationEntity } from '../entities';

import { NotificationsQueueEventsEnum } from './enums';
import { NOTIFICATION_QUEUE } from './constants';

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
