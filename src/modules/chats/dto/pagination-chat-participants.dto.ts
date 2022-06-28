import { PaginationMixin } from 'src/common/dto';

import { ChatParticipantEntity } from '../entities';

/**
 * [description]
 */
export class PaginationChatParticipantsDto extends PaginationMixin(ChatParticipantEntity) {
  constructor([result, total]: [ChatParticipantEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
}
