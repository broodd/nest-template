import { FindManyOptionsDto } from 'src/common/dto';
import { FindOneOptions } from 'typeorm';

import { UserEntity } from '../entities';
import { UserStatusEnum } from '../enums';

/**
 * [description]
 */
export class SelectUsersDto extends FindManyOptionsDto<UserEntity> {
  /**
   * [description]
   */
  public get where(): FindOneOptions<UserEntity>['where'] {
    return {
      status: UserStatusEnum.ACTIVATED,
    };
  }
}
