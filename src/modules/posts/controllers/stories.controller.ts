import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ConflictException,
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

import { ErrorTypeEnum } from 'src/common/enums';
import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { CreateChatMessageTextDto } from 'src/modules/chats/dto/chat-messages';
import { ChatsGateway, ChatsService } from 'src/modules/chats/services';
import { ChatMessageEntity } from 'src/modules/chats/entities';
import { PaginationUsersDto } from 'src/modules/users/dto';
import { UserEntity } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards';

import { StoriesService } from '../services';
import { StoryEntity } from '../entities';
import {
  PaginationStoriesDto,
  SelectStoriesDto,
  CreateStoryDto,
  UpdateStoryDto,
} from '../dto/stories';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('stories')
@Controller('stories')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class StoriesController {
  /**
   * [description]
   * @param storiesService
   * @param chatsService
   * @param chatsGateway
   */
  constructor(
    private readonly storiesService: StoriesService,
    private readonly chatsService: ChatsService,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post()
  public async createOne(
    @Body() data: CreateStoryDto,
    @User() owner: UserEntity,
  ): Promise<StoryEntity> {
    return this.storiesService.createOne({ ...data, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param conditions
   * @param data
   * @param owner
   */
  @Post(':id/comments')
  public async createOneComment(
    @Param() conditions: ID,
    @Body() data: CreateChatMessageTextDto,
    @User() owner: UserEntity,
  ): Promise<ChatMessageEntity> {
    const story = await this.storiesService.selectOne(conditions);
    if (story.ownerId === owner.id)
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR });

    let chat = await this.chatsService.selectOneByParticipants([story.ownerId, owner.id]);
    if (!chat)
      chat = await this.chatsService.createOne({
        participants: [{ user: { id: owner.id } }, { user: { id: story.ownerId } }],
      });

    return this.chatsGateway.createOne({ ...data, chat: { id: chat.id }, story }, owner);
  }

  /**
   * [description]
   * @param options
   */
  @Get('feed')
  public async selectManyAndCountByFollowings(
    @Query() options: SelectStoriesDto,
    @User() user: UserEntity,
  ): Promise<PaginationUsersDto> {
    options.userId = user.id;
    return this.storiesService.selectManyAndCountByFollowings(options);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectStoriesDto,
    @User() user: UserEntity,
  ): Promise<PaginationStoriesDto> {
    options.userId = user.id;
    return this.storiesService.selectManyAndCount(options);
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
    @Body() data: UpdateStoryDto,
    @User() owner: UserEntity,
  ): Promise<StoryEntity> {
    return this.storiesService.updateOne({ ...conditions, owner: { id: owner.id } }, data);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID, @User() owner: UserEntity): Promise<StoryEntity> {
    return this.storiesService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
