import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Patch,
  Query,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { UserEntity } from '../../users/entities';
import { JwtAuthGuard } from '../../auth/guards';

import { PostCommentsService } from '../services';
import { PostCommentEntity } from '../entities';
import {
  PaginationPostCommentsDto,
  SelectPostCommentsDto,
  CreatePostCommentDto,
  UpdatePostCommentDto,
} from '../dto/post-comments';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('post-comments')
@Controller('post-comments')
@UseInterceptors(ClassSerializerInterceptor)
export class PostCommentsController {
  /**
   * [description]
   * @param postCommentsService
   */
  constructor(private readonly postCommentsService: PostCommentsService) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post()
  public async createOne(
    @Body() data: CreatePostCommentDto,
    @User() owner: UserEntity,
  ): Promise<PostCommentEntity> {
    return this.postCommentsService.createOne({ ...data, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get('posts/:id')
  public async selectManyAndCount(
    @Param() conditions: ID,
    @Query() options: SelectPostCommentsDto,
    @User() user: UserEntity,
  ): Promise<PaginationPostCommentsDto> {
    options.userId = user.id;
    options.postId = conditions.id;
    return this.postCommentsService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   * @param owner
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdatePostCommentDto,
    @User() owner: UserEntity,
  ): Promise<PostCommentEntity> {
    return this.postCommentsService.updateOne({ ...conditions, owner: { id: owner.id } }, data);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<PostCommentEntity> {
    return this.postCommentsService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
