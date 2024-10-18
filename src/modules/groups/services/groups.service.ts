import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { PostEntity } from 'src/modules/posts/entities';
import { CommonService } from 'src/common/services';

import { PaginationGroupsDto } from '../dto';
import { GroupEntity, GroupSubscriberEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class GroupsService extends CommonService<GroupEntity, PaginationGroupsDto> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(GroupEntity)
    public readonly repository: Repository<GroupEntity>,
  ) {
    super(GroupEntity, repository, PaginationGroupsDto);
  }

  /**
   * Join partial columns of last post
   * @param qb
   */
  public selectLastPostQuery = (
    qb: SelectQueryBuilder<PostEntity>,
  ): SelectQueryBuilder<PostEntity> => {
    const columns = this.repository.manager
      .getRepository(PostEntity)
      .metadata.columns.map((el) => el.databaseName);

    qb.select(`JSON_BUILD_OBJECT(${columns.map((c) => `'${c}', PostEntity.${c}`).join(', ')})`)
      .from(PostEntity, 'PostEntity')
      .where('PostEntity.groupId = GroupEntity.id')
      .orderBy('PostEntity.createdAt', 'DESC')
      .limit(1);

    return qb;
  };

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyBracketsOptions<GroupEntity> = {},
  ): SelectQueryBuilder<GroupEntity> {
    const qb = super.find(optionsOrConditions);

    if (optionsOrConditions.loadEagerRelations !== false) {
      qb.addSelect(this.selectLastPostQuery, 'lastPost');

      qb.addSelect((sub) => {
        return sub
          .select('COUNT(GroupSubscriberEntity.id)')
          .from(GroupSubscriberEntity, 'GroupSubscriberEntity')
          .andWhere('GroupSubscriberEntity.groupId = GroupEntity.id');
      }, '__subscribers_count');
    }

    return qb;
  }
}
