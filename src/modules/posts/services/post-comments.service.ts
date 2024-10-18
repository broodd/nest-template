import { SelectQueryBuilder, FindOptionsUtils, Repository, IsNull } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { PostCommentEntity, PostCommentLikeEntity } from '../entities';
import { PaginationPostCommentsDto } from '../dto/post-comments';

/**
 * [description]
 */
@Injectable()
export class PostCommentsService extends CommonService<
  PostCommentEntity,
  PaginationPostCommentsDto
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(PostCommentEntity)
    public readonly repository: Repository<PostCommentEntity>,
  ) {
    super(PostCommentEntity, repository, PaginationPostCommentsDto);
  }

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyBracketsOptions<PostCommentEntity> = {},
  ): SelectQueryBuilder<PostCommentEntity> {
    const qb = super.find(optionsOrConditions);

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      const userId = optionsOrConditions.userId;

      qb.leftJoinAndSelect('PostCommentEntity.owner', 'owner');
      qb.leftJoinAndSelect('owner.cover', 'owner_cover');

      qb.leftJoinAndSelect('PostCommentEntity.replies', 'replies');
      qb.leftJoinAndSelect('replies.owner', 'replies_owner');
      qb.leftJoinAndSelect('replies_owner.cover', 'replies_owner_cover');

      qb.loadRelationCountAndMap('replies.__likes_count', 'replies.likes', 'replies_likes');
      if (userId)
        qb.loadRelationCountAndMap('replies.__is_liked', 'replies.likes', 'replies_likes', (sub) =>
          sub.andWhere('replies_likes.ownerId = :userId', { userId }),
        );

      qb.addSelect((sub) => {
        return sub
          .select('COUNT(PostCommentLikeEntity.id)')
          .from(PostCommentLikeEntity, 'PostCommentLikeEntity')
          .andWhere('PostCommentLikeEntity.commentId = PostCommentEntity.id');
      }, '__likes_count');

      if (userId)
        qb.addSelect((sub) => {
          return sub
            .select('true')
            .from(PostCommentLikeEntity, 'PostCommentLikeEntity')
            .andWhere('PostCommentLikeEntity.commentId = PostCommentEntity.id')
            .andWhere('PostCommentLikeEntity.ownerId = :userId', { userId });
        }, '__is_liked');
    }

    return qb;
  }

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<PostCommentEntity> = { loadEagerRelations: false },
  ): Promise<PaginationPostCommentsDto> {
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);

    qb.andWhere({ replyId: IsNull() });
    qb.addOrderBy('PostCommentEntity.createdAt', 'DESC');
    qb.addOrderBy('replies.createdAt', 'DESC');

    return qb
      .getManyAndCount()
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }
}
