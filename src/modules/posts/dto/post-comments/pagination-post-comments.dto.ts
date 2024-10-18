import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { PostCommentEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationPostCommentsDto extends PaginationDto<PostCommentEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [PostCommentEntity] })
  public readonly result: PostCommentEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
