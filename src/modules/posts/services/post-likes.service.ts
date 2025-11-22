import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/services';
import { PaginationDto } from 'src/common/dto';

import { PostCommentLikeEntity, PostLikeEntity } from '../entities';

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
