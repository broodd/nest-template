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

import { PostLikesService } from '../services';
import { PostLikeEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('post-likes')
@Controller('post-likes')
@UseInterceptors(ClassSerializerInterceptor)
export class PostLikesController {
  /**
   * [description]
   * @param postLikesService
   */
  constructor(private readonly postLikesService: PostLikesService) {}

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Post('posts/:id')
  public async createOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<PostLikeEntity> {
    return this.postLikesService.createOne({
      post: { id: conditions.id },
      owner: { id: owner.id },
    });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete('posts/:id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<PostLikeEntity> {
    return this.postLikesService.deleteOne({
      postId: conditions.id,
      ownerId: owner.id,
    });
  }
}
