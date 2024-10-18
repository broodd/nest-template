import { IsDate, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateNotificationDto } from './create-notification.dto';

/**
 * [description]
 */
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  /**
   * [description]
   */
  @IsDate()
  @IsOptional()
  public readonly readAt?: Date;
}
