import { PaginationMixin } from 'src/common/dto';

import { NotificationEntity } from '../entities';

export class PaginationNotificationsDto extends PaginationMixin(NotificationEntity) {
  constructor([result, count]: [NotificationEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
