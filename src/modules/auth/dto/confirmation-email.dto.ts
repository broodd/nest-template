import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { CreateUserDto } from 'src/modules/users/dto';

/**
 * [description]
 */
export class ConfirmationEmailDto extends PickType(CreateUserDto, ['email']) {
  /**
   * [description]
   */
  @Length(6)
  @IsString()
  @ApiProperty({ example: '123456', maxLength: 6 })
  public readonly code: string;
}
