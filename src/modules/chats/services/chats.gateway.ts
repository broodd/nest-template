import { UseFilters, UsePipes } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Server } from 'socket.io';
import { Not } from 'typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';

import { SocketsExceptionFilter } from 'src/common/filters';
import { SocketsService } from 'src/modules/sockets';
import { SocketUser } from 'src/common/decorators';
import { validationPipe } from 'src/common/pipes';

import { UserEntity } from 'src/modules/users/entities';

import { ChatMessageStatusEnum, ChatSocketEventsEnum } from '../enums';
import { ChatParticipantsService } from './chat-participants.service';
import { ChatMessagesService } from './chat-messages.service';
import { ChatsService } from './chats.service';
import {
  ChatReadMessageResponseDto,
  ChatReceiveMessageDto,
  CreateChatMessageDto,
  ChatReadMessageDto,
} from '../dto';

/**
 * [description]
 */
@WebSocketGateway({
  cors: { origin: '*' }, // TODO, TBD
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
  @SubscribeMessage(ChatSocketEventsEnum.CHAT_SEND_MESSAGE)
  public async handleSendMessage(
    @MessageBody() entityLike: CreateChatMessageDto,
    @SocketUser() user: UserEntity,
  ): Promise<void> {
    await this.chatParticipantsService.selectOne({ user: { id: user.id }, chat: entityLike.chat });

    const participantsIds = await this.chatParticipantsService.selectIds({
      where: { chat: entityLike.chat },
    });

    const message = await this.chatMessagesService.createOne({
      ...entityLike,
      owner: { id: user.id },
    });
    const chat = await this.chatsService.selectOneEager(entityLike.chat, user);

    const socketsIds = this.socketsService.selectAllIds(participantsIds);
    this.server.to(socketsIds).emit(
      ChatSocketEventsEnum.CHAT_RECEIVE_MESSAGE,
      new ChatReceiveMessageDto({
        chat: instanceToPlain(chat),
        message: instanceToPlain(message),
      }),
    );
  }

  /**
   * [description]
   * @param conditions
   * @param user
   */
  @SubscribeMessage(ChatSocketEventsEnum.CHAT_READ_MESSAGE)
  public async handleReadMessage(
    @MessageBody() conditions: ChatReadMessageDto,
    @SocketUser() user: UserEntity,
  ): Promise<void> {
    await this.chatParticipantsService.selectOne({ user: { id: user.id }, chat: conditions.chat });
    await this.chatMessagesService.updateOne(
      { ...conditions, owner: { id: Not(user.id) } },
      { status: ChatMessageStatusEnum.READ },
    );

    const participantsIds = await this.chatParticipantsService.selectIds({
      where: { chat: conditions.chat },
    });
    const socketsIds = this.socketsService.selectAllIds(participantsIds);

    this.server.to(socketsIds).emit(
      ChatSocketEventsEnum.CHAT_READ_MESSAGE,
      new ChatReadMessageResponseDto({
        chat: { id: conditions.chat.id },
        message: { id: conditions.id },
      }),
    );
  }
}
