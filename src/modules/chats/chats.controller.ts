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

import { User, UseRole } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { ID } from '../../common/dto';

import { UserEntity } from '../users/entities';

import { ChatMessagesService, ChatParticipantsService, ChatsService } from './services';
import { ChatEntity } from './entities';
import {
  ChatReadMessageResponseDto,
  PaginationChatMessagesDto,
  SelectChatMessagesDto,
  ChatReceiveMessageDto,
  CreateChatMessageDto,
  PaginationChatsDto,
  ChatReadMessageDto,
  SelectChatsDto,
  CreateChatDto,
} from './dto';
import { UserRoleEnum } from '../users/enums';

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
   * @param chatMessagesService
   * @param chatParticipantsService
   */
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatParticipantsService: ChatParticipantsService,
  ) {}

  /**
   * [description]
   * @param dto
   * @param user
   */
  @Post()
  public async createOne(
    @Body() dto: CreateChatDto,
    @User() user: UserEntity,
  ): Promise<ChatEntity> {
    const chat = await this.chatsService.selectOneByParticipants([user.id, dto.participant.id]);
    if (chat) return this.chatsService.selectOne({ id: chat.id }, { loadEagerRelations: true });

    return this.chatsService.createOne({
      participants: [{ user: { id: user.id } }, { user: dto.participant }],
    });
  }

  /**
   * [description]
   * @param options
   * @param user
   */
  @Get()
  public async selectAll(
    @Query() options: SelectChatsDto,
    @User() user: UserEntity,
  ): Promise<PaginationChatsDto> {
    return this.chatsService.selectAll(options, user);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  @UseRole(UserRoleEnum.ADMIN)
  public async deleteOne(@Param() conditions: ID): Promise<ChatEntity> {
    return this.chatsService.deleteOne(conditions);
  }

  /**
   * [description]
   * @param condition
   * @param options
   * @param user
   */
  @Get('/:id/messages')
  public async selectAllMessages(
    @Param() chatConditions: ID,
    @Query() options: SelectChatMessagesDto,
    @User() user: UserEntity,
  ): Promise<PaginationChatMessagesDto> {
    await this.chatParticipantsService.selectOne({ user: { id: user.id }, chat: chatConditions });
    return this.chatMessagesService.selectAll(options, chatConditions);
  }

  /**
   * [description]
   * @param condition
   * @param options
   * @param user
   */
  @Get('/messages/count/new')
  public async selectNewMessagesCount(@User() user: UserEntity): Promise<number> {
    return this.chatMessagesService.selectNewMessagesCount(user);
  }
}
