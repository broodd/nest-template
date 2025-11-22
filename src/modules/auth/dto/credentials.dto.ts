import { IsString, Length } from 'class-validator';

import { ApiProperty, PickType } from '@nestjs/swagger';

import { UserEntity } from 'src/modules/users/entities';
import { CreateUserDto } from 'src/modules/users/dto';

import { JwtTokensDto } from './jwt-tokens.dto';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {
  /**
   * [description]
   */
  @IsString()
  @ApiProperty({ example: 'Password1' })
  public readonly password: string;
}

/**
 * [description]
 */
export class CredentialsWithSecurityCodeDto extends CredentialsDto {
  /**
   * [description]
   */
  @IsString()
  @Length(6)
  @ApiProperty({ example: '123456', maxLength: 6 })
  public readonly code: string;
}

/**
 * [description]
 */
export class ResponseCredentialsDto {
  /**
   * [description]
   */
  @ApiProperty()
  public readonly user: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  public readonly tokens: JwtTokensDto;
}
