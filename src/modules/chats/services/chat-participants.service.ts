import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { PaginationChatParticipantsDto } from '../dto/chat-participants';
import { ChatEntity, ChatParticipantEntity } from '../entities';
import { FindManyBracketsOptions } from 'src/common/interfaces';

/**
 * [description]
 */
@Injectable()
export class ChatParticipantsService extends CommonService<
  ChatParticipantEntity,
  PaginationChatParticipantsDto
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(ChatParticipantEntity)
    public readonly repository: Repository<ChatParticipantEntity>,
  ) {
    super(ChatParticipantEntity, repository, PaginationChatParticipantsDto);
  }

  /**
   * [description]
   * @param options
   */
  public async selectIds(
    options: FindManyBracketsOptions<ChatParticipantEntity>,
  ): Promise<string[]> {
    return this.find(
      instanceToPlain({ ...options, select: { userId: true }, loadEagerRelations: false }),
    )
      .getMany()
      .then((data) => data.map((value) => value.userId))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANTS_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param participantIds
   * @deprecated
   */
  public async selectOneByParticipants(participantIds: string[]): Promise<Partial<ChatEntity>> {
    return this.find()
      .select('ChatParticipantEntity.chatId', 'id')
      .andWhere('ChatParticipantEntity.userId IN (:...participantIds)', { participantIds })
      .having(
        `ARRAY_LENGTH(ARRAY_AGG(ChatParticipantEntity.userId), 1) >= ${participantIds.length}`,
      )
      .groupBy('ChatParticipantEntity.chatId')
      .getRawOne();
  }
}
