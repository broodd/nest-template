import { PaginationMixin } from 'src/common/dto';

import { UserNotificationTokenEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationUserNotificationTokensDto extends PaginationMixin(
  UserNotificationTokenEntity,
) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [UserNotificationTokenEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
