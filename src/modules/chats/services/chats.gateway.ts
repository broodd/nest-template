import { UseFilters, UsePipes } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { instanceToPlain } from 'class-transformer';
import { IsNull, Not, Raw } from 'typeorm';
import { Server } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';

import { SocketsExceptionFilter } from 'src/common/filters';
import { SocketUser } from 'src/common/decorators';
import { validationPipe } from 'src/common/pipes';

import { SocketsService } from 'src/modules/sockets/services';
import { UserEntity } from 'src/modules/users/entities';

import { ChatParticipantsService } from './chat-participants.service';
import { ChatMessagesService } from './chat-messages.service';
import { ChatSocketEventsEnum } from '../enums';
import { ChatMessageEntity } from '../entities';
import { ChatsService } from './chats.service';
import {
  ChatReadMessageResponseDto,
  ChatReceiveMessageDto,
  CreateChatMessageDto,
  ChatReadMessageDto,
} from '../dto/chat-messages';

/**
 * [description]
 */
@WebSocketGateway({
  // namespace: 'chats',
  cors: { origin: '*' }, // TODO
  transports: ['websocket'],
})
@UsePipes(validationPipe)
@UseFilters(SocketsExceptionFilter)
export class ChatsGateway {
  /**
   * [description]
   */
  @WebSocketServer()
  private readonly server: Server;

  /**
   * [description]
   * @param chatsService
   * @param socketsService
   * @param chatMessagesService
   * @param chatParticipantsService
   */
  constructor(
    private readonly chatsService: ChatsService,
    private readonly socketsService: SocketsService,
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatParticipantsService: ChatParticipantsService,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param user
   */
  @Transactional()
  public async createOne(
    entityLike: CreateChatMessageDto,
    user: UserEntity,
  ): Promise<ChatMessageEntity> {
    const message = await this.chatMessagesService.createOne({
      ...entityLike,
      owner: { id: user.id },
    });

    const chat = await this.chatsService.selectOneWithOwner(entityLike.chat, {
      userId: user.id,
      loadEagerRelations: true,
    });
    const participantsIds = await this.chatParticipantsService.selectIds({
      where: { chatId: entityLike.chat.id },
    });
    const socketsIds = this.socketsService.selectManyIds(participantsIds);

    this.server.to(socketsIds).emit(
      ChatSocketEventsEnum.CHAT_RECEIVE_MESSAGE,
      new ChatReceiveMessageDto({
        chat: instanceToPlain(chat),
        message: instanceToPlain(message),
      }),
    );

    return message;
  }

  /**
   * [description]
   * @param entityLike
   * @param user
   */
  @Transactional()
  @SubscribeMessage(ChatSocketEventsEnum.CHAT_SEND_MESSAGE)
  public async handleSendMessage(
    @MessageBody() entityLike: CreateChatMessageDto,
    @SocketUser() user: UserEntity,
  ): Promise<void> {
    await this.chatParticipantsService.selectOne({ userId: user.id, chatId: entityLike.chat.id });
    await this.createOne(entityLike, user);
  }

  /**
   * [description]
   * @param conditions
   * @param user
   */
  @Transactional()
  @SubscribeMessage(ChatSocketEventsEnum.CHAT_READ_MESSAGE)
  public async handleReadMessage(
    @MessageBody() conditions: ChatReadMessageDto,
    @SocketUser() user: UserEntity,
  ): Promise<void> {
    await this.chatParticipantsService.selectOne({ user: { id: user.id }, chat: conditions.chat });

    const message = await this.chatMessagesService.selectOne({
      ...conditions,
      owner: { id: Not(user.id) },
    });

    await this.chatMessagesService.update(
      {
        chatId: conditions.chat.id,
        ownerId: Not(user.id),
        readAt: IsNull(),
        createdAt: Raw(
          (columnAlias) =>
            `ROUND(EXTRACT(EPOCH FROM ${columnAlias})::NUMERIC, 3) * 1000 <= :createdAt`,
          { createdAt: message.createdAt.getTime() + 1 },
        ),
      },
      { readAt: () => 'CURRENT_TIMESTAMP' },
    );

    const participantsIds = await this.chatParticipantsService.selectIds({
      where: { chatId: conditions.chat.id },
    });
    const socketsIds = this.socketsService.selectManyIds(participantsIds);

    this.server.to(socketsIds).emit(
      ChatSocketEventsEnum.CHAT_READ_MESSAGE,
      new ChatReadMessageResponseDto({
        chat: { id: conditions.chat.id },
        message: { id: conditions.id },
      }),
    );
  }
}
