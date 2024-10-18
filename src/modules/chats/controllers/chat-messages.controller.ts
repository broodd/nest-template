import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Param,
  Query,
  Get,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { UserEntity } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards';

import { ChatMessagesService, ChatParticipantsService } from '../services';
import { SelectChatMessagesDto } from '../dto/chat-messages';
import { ChatMessageEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('chat-messages')
@Controller('chat-messages')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatMessagesController {
  /**
   * [description]
   * @param chatMessagesService
   * @param chatParticipantsService
   */
  constructor(
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatParticipantsService: ChatParticipantsService,
  ) {}

  /**
   * [description]
   * @param conditions
   * @param options
   * @param user
   */
  @Get('chats/:id/messages')
  public async selectManyAndCount(
    @Param() conditions: ID,
    @Query() options: SelectChatMessagesDto,
    @User() user: UserEntity,
  ): Promise<ChatMessageEntity[]> {
    options.chatId = conditions.id;
    options.desc = ['createdAt'];

    await this.chatParticipantsService.selectOne({ userId: user.id, chatId: conditions.id });
    const result = await this.chatMessagesService.selectMany(options);
    return result.reverse();
  }
}
