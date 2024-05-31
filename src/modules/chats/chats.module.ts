import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { SocketsModule } from '../sockets';

import { ChatEntity, ChatMessageEntity, ChatParticipantEntity } from './entities';
import { ChatsController } from './controllers';
import {
  ChatParticipantsService,
  ChatMessagesService,
  ChatsGateway,
  ChatsService,
} from './services';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, ChatMessageEntity, ChatParticipantEntity]),
    SocketsModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatMessagesService, ChatParticipantsService, ChatsGateway],
  exports: [ChatsService, ChatMessagesService, ChatParticipantsService],
})
export class ChatsModule {}
