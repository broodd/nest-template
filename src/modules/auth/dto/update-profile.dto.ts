import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

import { UpdateUserDto } from 'src/modules/users/dto';

/**
 * [description]
 */
export class UpdateProfileDto extends PartialType(UpdateUserDto) {}

/**
 * [description]
 */
export class UpdatePasswordByCreateConfirmationDto extends PickType(UpdateUserDto, [
  'password',
  'email',
]) {
  /**
   * [description]
   */
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'Password1' })
  public readonly temporaryPassword: string;
}
