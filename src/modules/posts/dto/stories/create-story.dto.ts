import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreateStoryDto {
  /**
   * [description]
   */
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly image: ID;
}
