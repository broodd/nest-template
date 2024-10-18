import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';
import { ChatEntity } from '../entities';

/**
 * [description]
 */
export class PaginationChatsDto extends PaginationDto<ChatEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [ChatEntity] })
  public readonly result: ChatEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
