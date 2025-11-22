import { IsDefined, Matches } from 'class-validator';

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

import { UpdateUserDto } from '../../users/dto';

import { AUTH_PASSWORD_REGEX } from '../auth.constants';

/**
 * [description]
 */
export class UpdateProfileDto extends OmitType(UpdateUserDto, ['password', 'email']) {}

/**
 * [description]
 */
export class UpdateEmailDto extends PickType(UpdateUserDto, ['email', 'password']) {}

/**
 * [description]
 */
export class UpdatePasswordDto extends PickType(UpdateUserDto, ['password']) {
  /**
   * [description]
   */
  @IsDefined()
  @Matches(AUTH_PASSWORD_REGEX)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'Password1' })
  public readonly oldPassword: string;
}
