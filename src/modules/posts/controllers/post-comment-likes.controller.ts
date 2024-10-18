import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { UserEntity } from '../../users/entities';
import { JwtAuthGuard } from '../../auth/guards';

import { PostCommentLikesService } from '../services/post-likes.service';
import { PostCommentLikeEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('post-comment-likes')
@Controller('post-comment-likes')
@UseInterceptors(ClassSerializerInterceptor)
export class PostCommentLikesController {
  /**
   * [description]
   * @param postCommentLikesService
   */
  constructor(private readonly postCommentLikesService: PostCommentLikesService) {}

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Post('comments/:id')
  public async createOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<PostCommentLikeEntity> {
    return this.postCommentLikesService.createOne({
      comment: { id: conditions.id },
      owner: { id: owner.id },
    });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete('comments/:id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<PostCommentLikeEntity> {
    return this.postCommentLikesService.deleteOne({
      commentId: conditions.id,
      ownerId: owner.id,
    });
  }
}
