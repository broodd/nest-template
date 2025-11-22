import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { FindOneOptions, Brackets } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { GroupEntity } from '../entities';

/**
 * [description]
 */
export class SelectGroupsDto extends FindManyOptionsDto<GroupEntity> {
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
    const { search } = this;

    return new Brackets((qb) => {
      if (search) {
        qb.andWhere(`GroupEntity.name ILIKE :search`, { search: `%${search}%` });
      }
    });
  }
}
