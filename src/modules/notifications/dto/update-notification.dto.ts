import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateNotificationDto } from './create-notification.dto';
import { NotificationsStatusEnum } from '../enums';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  @IsEnum(NotificationsStatusEnum)
  public readonly status?: NotificationsStatusEnum;
}
