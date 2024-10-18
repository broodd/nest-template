import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { ChatEntity, ChatMessageEntity, ChatParticipantEntity } from './entities';
import { ChatMessagesController, ChatsController } from './controllers';
import { SocketsModule } from '../sockets';
import { UsersModule } from '../users';
import {
  ChatParticipantsService,
  ChatMessagesService,
  ChatsGateway,
  ChatsService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, ChatMessageEntity, ChatParticipantEntity]),
    SocketsModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<number>('JWT_EXPIRES_ACCESS_TOKEN');
        return {
          secret: configService.get('JWT_SECRET_ACCESS_TOKEN'),
          signOptions: Object.assign({}, expiresIn && { expiresIn }),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [ChatsController, ChatMessagesController],
  providers: [ChatsService, ChatMessagesService, ChatParticipantsService, ChatsGateway],
  exports: [ChatsService, ChatMessagesService, ChatParticipantsService, ChatsGateway],
})
export class ChatsModule {}
