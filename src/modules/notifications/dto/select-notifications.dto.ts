import { ApiHideProperty } from '@nestjs/swagger';
import { FindOneOptions } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { NotificationEntity } from '../entities';

/**
 * [description]
 */
export class SelectNotificationsDto extends FindManyOptionsDto<NotificationEntity> {
  /**
   * [description]
   */
  @ApiHideProperty()
  public ownerId?: string;

  /**
   * [description]
   */
  public get where(): FindOneOptions['where'] {
    const { ownerId } = this;

    return Object.assign({}, ownerId && { ownerId });
  }
}
