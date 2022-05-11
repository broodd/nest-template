import { MaxLength, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { NotificationsTypeEnum } from '../enums';

export class CreateNotificationDto {
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty()
  public readonly title: string;

  @IsEnum(NotificationsTypeEnum)
  @ApiProperty()
  public readonly type: NotificationsTypeEnum;
}
