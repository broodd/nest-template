import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Brackets } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';
import { querySearch } from 'src/common/helpers';

import { ChatEntity } from '../entities';

/**
 * [description]
 */
export class SelectChatsDto extends FindManyOptionsDto<ChatEntity> {
  /**
   * [description]
   */
  @IsOptional()
  @MinLength(3)
  @MaxLength(256)
  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.replace(/\s/g, ''))
  public readonly search?: string;

  /**
   * Active chat will sort as first in the list
   */
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly activeChatId?: string;

  /**
   * [description]
   */
  public get whereBrackets(): Brackets {
    const { search } = this;
    return new Brackets((qb) => {
      if (search)
        qb.andWhere(querySearch('ChatEntity_participant_other_user.email'), {
          search: `%${search}%`,
        });
    });
  }
}
