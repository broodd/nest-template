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

import { PaginationPostsDto, SelectPostsDto, CreatePostDto, UpdatePostDto } from '../dto';
import { PostsService } from '../services';
import { PostEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  /**
   * [description]
   * @param postsService
   */
  constructor(private readonly postsService: PostsService) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post()
  public async createOne(
    @Body() data: CreatePostDto,
    @User() owner: UserEntity,
  ): Promise<PostEntity> {
    return this.postsService.createOne({ ...data, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param options
   * @param user
   */
  @Get('feed')
  public async selectManyAndCountByFollowings(
    @Query() options: SelectPostsDto,
    @User() user: UserEntity,
  ): Promise<PaginationPostsDto> {
    options.userId = user.id;
    return this.postsService.selectManyAndCountByFollowings(options);
  }

  /**
   * [description]
   * @param options
   * @param user
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectPostsDto,
    @User() user: UserEntity,
  ): Promise<PaginationPostsDto> {
    options.userId = user.id;
    return this.postsService.selectManyAndCount(options);
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
    @Body() data: UpdatePostDto,
    @User() owner: UserEntity,
  ): Promise<PostEntity> {
    return this.postsService.updateOne({ ...conditions, owner: { id: owner.id } }, data);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID, @User() owner: UserEntity): Promise<PostEntity> {
    return this.postsService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
