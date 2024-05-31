import { IsOptional, IsEnum } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Brackets } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { NotificationsStatusEnum } from '../enums';
import { NotificationEntity } from '../entities';

/**
 * [description]
 */
export class SelectNotificationsDto extends FindManyOptionsDto<NotificationEntity> {
  /**
   * [description]
   */
  @IsOptional()
  @ApiHideProperty()
  public ownerId?: string;

  /**
   * [description]
   */
  @IsOptional()
  @IsEnum(NotificationsStatusEnum)
  @ApiProperty({ enum: NotificationsStatusEnum })
  public readonly status?: NotificationsStatusEnum;

  /**
   * [description]
   */
  public get whereBrackets(): Brackets {
    const { status, ownerId } = this;

    return new Brackets((qb) => {
      qb.where(Object.assign({}, status && { status }, ownerId && { ownerId }));
    });
  }
}
