import { IsString } from 'class-validator';

import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';

import { UserStatusEnum } from 'src/modules/users/enums';
import { CreateUserDto } from 'src/modules/users/dto';

/**
 * [description]
 */
export class CreateProfileDto extends PickType(CreateUserDto, ['password', 'email']) {}

/**
 * [description]
 */
export class CreateProfileConfirmationDto extends PickType(CreateUserDto, ['email', 'password']) {
  /**
   * [description]
   */
  @IsString()
  @ApiProperty({ example: '727272' })
  public readonly code: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  public status: UserStatusEnum.ACTIVATED;
}
