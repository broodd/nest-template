import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { ChatMessageEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationChatMessagesDto extends PaginationDto<ChatMessageEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [ChatMessageEntity] })
  public readonly result: ChatMessageEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
