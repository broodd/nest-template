import { IsEmail, IsOptional, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreateUserDto {
  /**
   * [description]
   */
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com', maxLength: 320 })
  public readonly email: string;

  /**
   * [description]
   */
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'password' })
  public readonly password: string;

  /**
   * [description]
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => ID)
  @ApiProperty({ type: () => ID })
  public readonly cover?: ID;
}
