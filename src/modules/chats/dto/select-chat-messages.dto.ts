import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { ChatMessageEntity } from '../entities';

/**
 * [description]
 */
export class SelectChatMessagesDto extends FindManyOptionsDto<ChatMessageEntity> {
  /**
   * [description]
   */
  @ApiProperty({
    type: [String],
    example: ['createdAt'],
    default: ['createdAt'],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public readonly desc?: [keyof ChatMessageEntity] = ['createdAt'];
}
