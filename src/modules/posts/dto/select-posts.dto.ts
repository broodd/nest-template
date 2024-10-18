import { Brackets, FindOneOptions, ILike } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsUUID,
  Max,
} from 'class-validator';

import { toNumArrayByComa } from 'src/common/helpers';
import { FindManyOptionsDto } from 'src/common/dto';

import { PostEntity } from '../entities';

/**
 * [description]
 */
export class SelectPostsDto extends FindManyOptionsDto<PostEntity> {
  /**
   * [description]
   */
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  public ownerId?: string;

  /**
   * [description]
   */
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  public groupId?: string;

  /**
   * [description]
   */
  @Max(500)
  public take?: number = 500;

  /**
   * [description]
   */
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @ApiProperty({ example: ['2.5559', '49.0083'] })
  @Transform(({ value }) => toNumArrayByComa(value))
  public readonly coordinates?: [number, number];

  /**
   * [description]
   */
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public readonly maxDistance?: number;

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty()
  public readonly search?: string;

  /**
   * [description]
   */
  public get whereBrackets(): FindOneOptions['where'] {
    const { ownerId, groupId, search } = this;

    return new Brackets((qb) => {
      qb.where(Object.assign({}, ownerId && { ownerId }, groupId && { groupId }));

      if (search) {
        const like = ILike(`%${search.trim()}%`);
        qb.andWhere({ text: like });
      }
    });
  }
}
