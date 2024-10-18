import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { ChatParticipantEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationChatParticipantsDto extends PaginationDto<ChatParticipantEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [ChatParticipantEntity] })
  public readonly result: ChatParticipantEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
