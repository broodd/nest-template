import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { PostEntity } from '../entities';

/**
 * [description]
 */
export class PaginationPostsDto extends PaginationDto<PostEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [PostEntity] })
  public readonly result: PostEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
