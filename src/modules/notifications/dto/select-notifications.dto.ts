import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Brackets } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { NotificationsStatusEnum } from '../enums';
import { NotificationEntity } from '../entities';

export class SelectNotificationsDto extends FindManyOptionsDto<NotificationEntity> {
  @IsOptional()
  @IsEnum(NotificationsStatusEnum)
  @ApiProperty({ enum: NotificationsStatusEnum })
  public readonly status?: NotificationsStatusEnum;

  public get where(): Brackets {
    const { status } = this;

    return new Brackets((qb) => {
      qb.where(Object.assign({}, status && { status }));
    });
  }
}
