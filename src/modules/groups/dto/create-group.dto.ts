import { ValidateNested, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class CreateGroupDto {
  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(128)
  @ApiProperty({ minLength: 1, maxLength: 128 })
  public readonly name: string;

  /**
   * [description]
   */
  @IsOptional()
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly cover?: ID;
}
