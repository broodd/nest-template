import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/services';

import { PostCommentLikeEntity, PostLikeEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';

/**
 * [description]
 */
@Injectable()
export class PostLikesService extends CommonService<PostLikeEntity, PaginationDto<PostLikeEntity>> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(PostLikeEntity)
    public readonly repository: Repository<PostLikeEntity>,
  ) {
    super(PostLikeEntity, repository, PaginationDto<PostLikeEntity>);
  }
}

/**
 * [description]
 */
@Injectable()
export class PostCommentLikesService extends CommonService<
  PostCommentLikeEntity,
  PaginationDto<PostCommentLikeEntity>
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(PostCommentLikeEntity)
    public readonly repository: Repository<PostCommentLikeEntity>,
  ) {
    super(PostCommentLikeEntity, repository, PaginationDto<PostCommentLikeEntity>);
  }
}
