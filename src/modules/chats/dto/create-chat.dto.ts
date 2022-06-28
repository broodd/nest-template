import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreateChatDto {
  /**
   * [description]
   */
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly participant: ID;
}
