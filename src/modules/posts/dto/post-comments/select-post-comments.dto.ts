import { IsOptional, IsUUID } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { FindOneOptions } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { PostCommentEntity } from '../../entities';

/**
 * [description]
 */
export class SelectPostCommentsDto extends FindManyOptionsDto<PostCommentEntity> {
  /**
   * [description]
   */
  @ApiHideProperty()
  public userId?: string;

  /**
   * [description]
   */
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  public postId?: string;

  /**
   * [description]
   */
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  public ownerId?: string;

  /**
   * [description]
   */
  public get whereBrackets(): FindOneOptions['where'] {
    const { postId, ownerId } = this;

    return Object.assign({}, postId && { postId }, ownerId && { ownerId });
  }
}
