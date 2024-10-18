import { Brackets, FindOneOptions } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { ChatMessageEntity } from '../../entities';

/**
 * [description]
 */
export class SelectChatMessagesDto extends FindManyOptionsDto<ChatMessageEntity> {
  /**
   * [description]
   */
  @ApiHideProperty()
  public chatId?: string;

  /**
   * [description]
   */
  public get whereBrackets(): FindOneOptions['where'] {
    const { chatId } = this;

    return new Brackets((qb) => {
      qb.where(Object.assign({}, chatId && { chatId }));
    });
  }
}
