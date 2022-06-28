import { PaginationMixin } from 'src/common/dto';

import { ChatMessageEntity } from '../entities';

/**
 * [description]
 */
export class PaginationChatMessagesDto extends PaginationMixin(ChatMessageEntity) {
  constructor([result, total]: [ChatMessageEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
}
