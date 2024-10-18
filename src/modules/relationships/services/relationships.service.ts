import { SelectQueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';

import { SelectRelationshipsByTypeEnum } from '../enums';
import { PaginationRelationshipsDto } from '../dto';
import { RelationshipEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class RelationshipsService extends CommonService<
  RelationshipEntity,
  PaginationRelationshipsDto
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(RelationshipEntity)
    public readonly repository: Repository<RelationshipEntity>,
  ) {
    super(RelationshipEntity, repository, PaginationRelationshipsDto);
  }

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyBracketsOptions<RelationshipEntity> = {},
  ): SelectQueryBuilder<RelationshipEntity> {
    const qb = super.find(optionsOrConditions);
    const type = optionsOrConditions['type'];

    if (type) {
      if (type === SelectRelationshipsByTypeEnum.FOLLOWERS) {
        qb.leftJoinAndSelect('RelationshipEntity.owner', 'owner');
        qb.leftJoinAndSelect('owner.cover', 'owner_cover');
      } else {
        qb.leftJoinAndSelect('RelationshipEntity.target', 'target');
        qb.leftJoinAndSelect('target.cover', 'target_cover');
      }
    }

    return qb;
  }
}
