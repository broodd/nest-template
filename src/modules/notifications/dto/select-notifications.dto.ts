import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Brackets, Equal } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { NotificationsStatusEnum } from '../enums';
import { NotificationEntity } from '../entities';

export class SelectNotificationsDto extends FindManyOptionsDto<NotificationEntity> {
  @IsOptional()
  @IsEnum(NotificationsStatusEnum)
  @ApiProperty({ enum: NotificationsStatusEnum })
  public readonly status?: NotificationsStatusEnum;

  public get where(): Brackets {
    const { status, ...other } = this;

    const callback = (key) => !Object.keys(other).includes(key);
    const filtersAreEmpty = Object.keys(this).filter(callback).length < 1;

    if (filtersAreEmpty) return null;

    return new Brackets((qb) => {
      qb.where(Object.assign({}, status && { status: Equal(status) }));
    });
  }
}
