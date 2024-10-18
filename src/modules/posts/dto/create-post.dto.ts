import { ValidateNested, ArrayMaxSize, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ID } from 'src/common/dto';

import { CreateLocationDto } from './create-location.dto';

/**
 * [description]
 */
export class CreatePostDto {
  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(6e4)
  @ApiProperty()
  public readonly description: string;

  /**
   * [description]
   */
  @IsOptional()
  @Type(() => ID)
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly group?: ID;

  /**
   * [description]
   */
  @IsOptional()
  @Type(() => ID)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @ApiProperty({ type: () => [ID] })
  public readonly images?: ID[];

  /**
   * [description]
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  @ApiProperty({ type: () => CreateLocationDto })
  public readonly location?: CreateLocationDto;
}
