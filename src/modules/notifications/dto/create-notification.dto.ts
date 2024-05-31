import { MaxLength, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { NotificationsTypeEnum } from '../enums';

/**
 * [description]
 */
export class CreateNotificationDto {
  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty()
  public readonly title: string;

  /**
   * [description]
   */
  @ApiProperty()
  @IsEnum(NotificationsTypeEnum)
  public readonly type: NotificationsTypeEnum;
}
