import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateNotificationDto } from './create-notification.dto';
import { NotificationsStatusEnum } from '../enums';

/**
 * [description]
 */
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  /**
   * [description]
   */
  @IsOptional()
  @IsEnum(NotificationsStatusEnum)
  public readonly status?: NotificationsStatusEnum;
}
