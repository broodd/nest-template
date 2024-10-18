import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Stringifier } from 'csv-stringify';

import { FindManyBracketsOptions, FindOneBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { RelationshipEntity } from 'src/modules/relationships/entities';
import { PostEntity } from 'src/modules/posts/entities';

import { PaginationUsersDto } from '../dto';
import { UserEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class UsersService extends CommonService<UserEntity, PaginationUsersDto> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly repository: Repository<UserEntity>,
  ) {
    super(UserEntity, repository, PaginationUsersDto);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOneWithCounters(
    conditions: FindOneOptions<UserEntity>['where'],
    options: FindOneBracketsOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<UserEntity> {
    const userId = options.userId;
    const qb = this.find({ ...instanceToPlain(options), where: conditions });
    qb.leftJoinAndSelect('UserEntity.backgroudCover', 'backgroudCover');

    qb.leftJoinAndSelect(
      'UserEntity.stories',
      'StoryEntity',
      `StoryEntity.createdAt >= CURRENT_TIMESTAMP - INTERVAL '24 hours'`,
    );
    qb.leftJoinAndSelect('StoryEntity.image', 'image');
    qb.leftJoinAndMapOne(
      'StoryEntity.viewed',
      'StoryEntity.views',
      'views',
      'views.userId = :userId',
      { userId },
    );

    qb.addSelect(
      'CASE WHEN SUM(CASE WHEN views.id IS NOT NULL THEN 1 END) OVER () = ' +
        'COUNT(StoryEntity.id) OVER () THEN true ELSE false END',
      '__is_viewed_stories',
    );

    qb.addSelect((sub) => {
      return sub
        .select('COUNT(PostEntity.id)')
        .from(PostEntity, 'PostEntity')
        .andWhere('PostEntity.ownerId = UserEntity.id');
    }, '__posts_count');

    qb.addSelect((sub) => {
      return sub
        .select('COUNT(RelationshipEntity.id)')
        .from(RelationshipEntity, 'RelationshipEntity')
        .andWhere('RelationshipEntity.targetId = UserEntity.id')
        .andWhere('RelationshipEntity.isBlocked = false');
    }, '__followers_count');

    qb.addSelect((sub) => {
      return sub
        .select('COUNT(RelationshipEntity.id)')
        .from(RelationshipEntity, 'RelationshipEntity')
        .andWhere('RelationshipEntity.ownerId = UserEntity.id')
        .andWhere('RelationshipEntity.isBlocked = false');
    }, '__followings_count');

    return qb.getOneOrFail().catch((error) => {
      throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
    });
  }

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<PaginationUsersDto> {
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);

    const userId = options.userId;
    if (userId) {
      qb.leftJoin('UserEntity.followers', 'followers', 'followers.ownerId = :userId', { userId });
      qb.addSelect('followers.id', '__is_followings');

      // Check UserEntity block request_user, or request_user block UserEntity
      qb.leftJoin('UserEntity.followings', 'followings', 'followings.targetId = :userId', {
        userId,
      });

      qb.andWhere('(followers.id IS NULL OR followers.isBlocked = false)');
      qb.andWhere('(followings.id IS NULL OR followings.isBlocked = false)');
    }

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
  public async exportManyAsCSV(
    options: FindManyBracketsOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<Stringifier> {
    /**
     * key -> csv header column name
     * value -> query alias
     */
    const fields: Record<string, string> = {
      id: 'id',
      name: 'name',
      email: 'email',
      createdAt: 'createdAt',
      postsCount: '_.posts_count', // fromRawToEntity() in CommonService change original alias __posts_count
      cover: '_.cover.src', // fromRawToEntity() in CommonService change original alias UserEntity__cover
    };

    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);
    qb.limit(options.take);
    qb.offset(options.skip);

    return this.streamExportCSV(fields, qb);
  }
}
