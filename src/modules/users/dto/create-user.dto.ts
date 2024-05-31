import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsOptional,
  IsDefined,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
} from 'class-validator';

import { AUTH_PASSWORD_REGEX } from 'src/modules/auth/auth.constants';
import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreateUserDto {
  /**
   * [description]
   */
  @IsEmail()
  @MaxLength(50)
  @ApiProperty({ example: 'admin@gmail.com', maxLength: 50 })
  public readonly email: string;

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(3)
  @MaxLength(128)
  @ApiProperty({ minLength: 2, maxLength: 128 })
  public readonly name?: string;

  /**
   * [description]
   */
  @IsDefined()
  @Matches(AUTH_PASSWORD_REGEX)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'Password1' })
  public readonly password: string;

  /**
   * [description]
   */
  @IsOptional()
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly cover?: ID;
}
