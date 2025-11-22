import { IsString, Length } from 'class-validator';

import { ApiProperty, PickType } from '@nestjs/swagger';

import { CreateUserDto } from '../../users/dto';

/**
 * [description]
 */
export class ConfirmationEmailDto extends PickType(CreateUserDto, ['email', 'password']) {
  /**
   * [description]
   */
  @Length(6)
  @IsString()
  @ApiProperty({ example: '123456', maxLength: 6 })
  public readonly code: string;
}
