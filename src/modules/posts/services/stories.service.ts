import { SelectQueryBuilder, FindOptionsUtils, FindManyOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { RelationshipEntity } from 'src/modules/relationships/entities';
import { UsersService } from 'src/modules/users/services';

import { PaginationStoriesDto } from '../dto/stories';
import { StoryEntity } from '../entities';
import { PaginationUsersDto } from 'src/modules/users/dto';

/**
 * [description]
 */
@Injectable()
export class StoriesService extends CommonService<StoryEntity, PaginationStoriesDto> {
  /**
   * [description]
   * @param repository
   * @param usersServices
   */
  constructor(
    @InjectRepository(StoryEntity)
    public readonly repository: Repository<StoryEntity>,
    public readonly usersServices: UsersService,
  ) {
    super(StoryEntity, repository, PaginationStoriesDto);
  }

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyOptions<StoryEntity> = {},
  ): SelectQueryBuilder<StoryEntity> {
    const qb = super.find(optionsOrConditions);

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      qb.leftJoinAndSelect('StoryEntity.owner', 'owner');
      qb.leftJoinAndSelect('owner.cover', 'owner_cover');
    }

    return qb;
  }

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<StoryEntity> = { loadEagerRelations: false },
  ): Promise<PaginationStoriesDto> {
    const userId = options.userId;
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);

    qb.innerJoinAndSelect('StoryEntity.image', 'image');
    qb.leftJoinAndMapOne(
      'StoryEntity.viewed',
      'StoryEntity.views',
      'views',
      'views.userId = :userId',
      { userId },
    );

    // show created only 24 hours ago
    qb.andWhere(`StoryEntity.createdAt >= CURRENT_TIMESTAMP - INTERVAL '24 hours'`);

    qb.addOrderBy('StoryEntity.createdAt', 'DESC');

    return qb
      .getManyAndCount()
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCountByFollowings(
    options: FindManyBracketsOptions<StoryEntity> = { loadEagerRelations: false },
  ): Promise<PaginationUsersDto> {
    const userId = options.userId;
    const qb = this.usersServices.find(options as unknown);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);

    qb.innerJoinAndSelect(
      'UserEntity.stories',
      'StoryEntity',
      `StoryEntity.createdAt >= CURRENT_TIMESTAMP - INTERVAL '24 hours'`,
    );
    qb.innerJoinAndSelect('StoryEntity.image', 'image');

    qb.leftJoinAndMapOne(
      'StoryEntity.viewed',
      'StoryEntity.views',
      'views',
      'views.userId = :userId',
      { userId },
    );
    qb.addSelect(
      'CASE WHEN SUM(CASE WHEN views.id IS NOT NULL THEN 1 END) OVER (PARTITION BY UserEntity.id) = ' +
        'COUNT(StoryEntity.id) OVER (PARTITION BY UserEntity.id) THEN true ELSE false END',
      '__is_viewed_stories',
    );

    // Select own request_user stories, or story of followings users
    qb.leftJoin(
      RelationshipEntity,
      'RelationshipEntity',
      `RelationshipEntity.targetId = StoryEntity.ownerId AND ` +
        `RelationshipEntity.ownerId = :userId AND ` +
        `RelationshipEntity.isBlocked = false`,
      { userId },
    );
    qb.andWhere('(StoryEntity.ownerId = :userId OR RelationshipEntity.id IS NOT NULL)');

    // sort own stories first
    qb.addSelect(
      `(CASE StoryEntity.ownerId WHEN '${userId}' THEN 1 ELSE 0 END)`,
      '__is_active',
    ).orderBy('__is_active', 'DESC');

    qb.addOrderBy('StoryEntity.createdAt', 'DESC');

    return qb
      .getManyAndCount()
      .then((data) => new PaginationUsersDto(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }
}
