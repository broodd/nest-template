import { IsOptional, IsUUID } from 'class-validator';
import { Brackets, FindOneOptions } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { StoryEntity } from '../../entities';

/**
 * [description]
 */
export class SelectStoriesDto extends FindManyOptionsDto<StoryEntity> {
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
  public get whereBrackets(): FindOneOptions['where'] {
    const { ownerId } = this;

    return new Brackets((qb) => {
      if (ownerId) qb.andWhere('StoryEntity.ownerId = :ownerId', { ownerId });
    });
  }
}
