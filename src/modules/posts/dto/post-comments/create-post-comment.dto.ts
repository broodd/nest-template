import { ValidateNested, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreatePostCommentDto {
  /**
   * [description]
   */
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly post: ID;

  /**
   * [description]
   */
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly reply: ID;

  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(5120)
  @ApiProperty()
  public readonly text: string;
}
