import { PaginationMixin } from 'src/common/dto';

import { UserEntity } from '../entities';

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
