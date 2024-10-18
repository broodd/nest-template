import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Brackets, FindOneOptions } from 'typeorm';

import { FindManyOptionsDto } from 'src/common/dto';

import { SelectRelationshipsByTypeEnum } from '../enums';
import { RelationshipEntity } from '../entities';

/**
 * [description]
 */
export class SelectRelationshipsDto extends FindManyOptionsDto<RelationshipEntity> {
  /**
   * [description]
   */
  @ApiHideProperty()
  public ownerId: string;

  /**
   * [description]
   */
  @ApiProperty()
  @IsEnum(SelectRelationshipsByTypeEnum)
  public readonly type: SelectRelationshipsByTypeEnum;

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
    const { type, ownerId, search } = this;

    const targetRelationAlias =
      type === SelectRelationshipsByTypeEnum.FOLLOWERS ? 'owner' : 'target';
    const ownerRelationField =
      type === SelectRelationshipsByTypeEnum.FOLLOWERS ? 'targetId' : 'ownerId';

    return new Brackets((qb) => {
      qb.andWhere({ [ownerRelationField]: ownerId });
      qb.andWhere({ isBlocked: type === SelectRelationshipsByTypeEnum.BLOCKED });

      if (search) {
        qb.andWhere(`${targetRelationAlias}.name ILIKE :search`, { search: `%${search}%` });
      }
    });
  }
}
