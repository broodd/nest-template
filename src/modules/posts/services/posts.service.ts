import { SelectQueryBuilder, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { RelationshipEntity } from 'src/modules/relationships/entities';

import { PostCommentEntity, PostEntity, PostLikeEntity } from '../entities';
import { CreateLocationDto, PaginationPostsDto } from '../dto';

/**
 * [description]
 */
@Injectable()
export class PostsService extends CommonService<PostEntity, PaginationPostsDto> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(PostEntity)
    public readonly repository: Repository<PostEntity>,
  ) {
    super(PostEntity, repository, PaginationPostsDto);
  }

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyBracketsOptions<PostEntity> & {
      coordinates?: CreateLocationDto['coordinates'];
      maxDistance?: number;
    } = {},
  ): SelectQueryBuilder<PostEntity> {
    const qb = super.find(optionsOrConditions);
    const { coordinates, maxDistance } = optionsOrConditions;

    if (coordinates) {
      qb.andWhere('PostEntity.location IS NOT NULL');

      const location = new CreateLocationDto(coordinates);
      const loactionST_GeoJSON = `ST_GeomFromGeoJSON('${JSON.stringify(location)}')`;

      if (maxDistance)
        qb.andWhere(`ST_DWithin(PostEntity.location, ${loactionST_GeoJSON}, ${maxDistance})`);

      qb.addSelect(
        `ROUND(ST_Distance(PostEntity.location, ${loactionST_GeoJSON})::NUMERIC, 3)`,
        'distance',
      ).addOrderBy('distance', 'ASC');
    }

    if (optionsOrConditions.loadEagerRelations !== false) {
      qb.leftJoinAndSelect('PostEntity.images', 'images');
      qb.leftJoinAndSelect('PostEntity.owner', 'owner');
      qb.leftJoinAndSelect('owner.cover', 'owner_cover');

      qb.addSelect((sub) => {
        return sub
          .select('COUNT(PostLikeEntity.id)')
          .from(PostLikeEntity, 'PostLikeEntity')
          .andWhere('PostLikeEntity.postId = PostEntity.id');
      }, '__likes_count');

      qb.addSelect((sub) => {
        return sub
          .select('COUNT(PostCommentEntity.id)')
          .from(PostCommentEntity, 'PostCommentEntity')
          .andWhere('PostCommentEntity.postId = PostEntity.id');
      }, '__comments_count');

      const userId = optionsOrConditions.userId;
      if (userId)
        qb.addSelect((sub) => {
          return sub
            .select('true')
            .from(PostLikeEntity, 'PostLikeEntity')
            .andWhere('PostLikeEntity.postId = PostEntity.id')
            .andWhere('PostLikeEntity.ownerId = :userId', { userId });
        }, '__is_liked');
    }

    return qb;
  }

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCountByFollowings(
    options: FindManyBracketsOptions<PostEntity> = { loadEagerRelations: false },
  ): Promise<PaginationPostsDto> {
    const userId = options.userId;
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);

    // Select own request_user posts, or posts of followings users
    qb.leftJoin(
      RelationshipEntity,
      'RelationshipEntity',
      `RelationshipEntity.targetId = PostEntity.ownerId AND ` +
        `RelationshipEntity.ownerId = :userId AND ` +
        `RelationshipEntity.isBlocked = false`,
      { userId },
    );
    qb.andWhere('(PostEntity.ownerId = :userId OR RelationshipEntity.id IS NOT NULL)');

    // Not select posts of users which blocked request_user
    qb.leftJoin(
      RelationshipEntity,
      'RelationshipEntityBlocked',
      `RelationshipEntityBlocked.targetId = :userId AND ` +
        `RelationshipEntityBlocked.ownerId = PostEntity.ownerId AND ` +
        `RelationshipEntityBlocked.isBlocked = true`,
      { userId },
    );
    qb.andWhere('RelationshipEntityBlocked.id IS NULL');

    return qb
      .getManyAndCount()
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }
}
