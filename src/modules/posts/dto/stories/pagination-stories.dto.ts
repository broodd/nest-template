import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { StoryEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationStoriesDto extends PaginationDto<StoryEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [StoryEntity] })
  public readonly result: StoryEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
