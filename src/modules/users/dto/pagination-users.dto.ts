import { PaginationMixin } from 'src/common/dto';

import { UserEntity, UserRefreshTokenEntity } from '../entities';

/**
 * [description]
 */
export class PaginationUsersDto extends PaginationMixin(UserEntity) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [UserEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}

/**
 * [description]
 */
export class PaginationUsersRefreshTokensDto extends PaginationMixin(UserRefreshTokenEntity) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [UserRefreshTokenEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
