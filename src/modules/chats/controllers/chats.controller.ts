import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Query,
  Body,
  Post,
  Get,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from 'src/modules/auth/guards';
import { UserEntity } from 'src/modules/users/entities';

import { PaginationChatsDto, SelectChatsDto, CreateChatDto } from '../dto';
import { ChatParticipantsService, ChatsService } from '../services';
import { ChatEntity } from '../entities';
import {
  ChatReadMessageResponseDto,
  ChatReceiveMessageDto,
  CreateChatMessageDto,
  ChatReadMessageDto,
} from '../dto/chat-messages';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(
  ChatReadMessageDto,
  CreateChatMessageDto,
  ChatReceiveMessageDto,
  ChatReadMessageResponseDto,
)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatsController {
  /**
   * [description]
   * @param chatsService
   * @param chatParticipantsService
   */
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatParticipantsService: ChatParticipantsService,
  ) {}

  /**
   * [description]
   * @param data
   * @param user
   */
  @Post()
  public async createOne(
    @Body() data: CreateChatDto,
    @User() user: UserEntity,
  ): Promise<ChatEntity> {
    const chat = await this.chatsService.selectOneByParticipants([user.id, data.participant.id]);
    if (chat) return this.chatsService.selectOne({ id: chat.id }, { loadEagerRelations: true });

    return this.chatsService.createOne({
      participants: [{ user: { id: user.id } }, { user: data.participant }],
    });
  }

  /**
   * [description]
   * @param options
   * @param user
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectChatsDto,
    @User() user: UserEntity,
  ): Promise<PaginationChatsDto> {
    options.userId = user.id;
    return this.chatsService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID, @User() user: UserEntity): Promise<ChatEntity> {
    await this.chatParticipantsService.selectOne({ userId: user.id, chatId: conditions.id });
    return this.chatsService.deleteOne(conditions);
  }
}
