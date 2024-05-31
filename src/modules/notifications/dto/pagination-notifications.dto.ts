import { PaginationMixin } from 'src/common/dto';

import { NotificationEntity } from '../entities';

/**
 * [description]
 */
export class PaginationNotificationsDto extends PaginationMixin(NotificationEntity) {
  /**
   * [description]
   */
  constructor([result, count]: [NotificationEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
