import { PaginationMixin } from 'src/common/dto';

import { ChatEntity } from '../entities';

/**
 * [description]
 */
export class PaginationChatsDto extends PaginationMixin(ChatEntity) {
  constructor([result, total]: [ChatEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
}
