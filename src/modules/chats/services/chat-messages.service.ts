import { SelectQueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';

import { PaginationChatMessagesDto } from '../dto/chat-messages';
import { ChatMessageEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class ChatMessagesService extends CommonService<
  ChatMessageEntity,
  PaginationChatMessagesDto
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(ChatMessageEntity)
    public readonly repository: Repository<ChatMessageEntity>,
  ) {
    super(ChatMessageEntity, repository, PaginationChatMessagesDto);
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyBracketsOptions<ChatMessageEntity>,
  ): SelectQueryBuilder<ChatMessageEntity> {
    const qb = super.find(optionsOrConditions);

    if (optionsOrConditions.loadEagerRelations !== false) {
      qb.leftJoinAndSelect('ChatMessageEntity.story', 'story');
      qb.leftJoinAndSelect('story.image', 'story_image');
      qb.leftJoinAndSelect('ChatMessageEntity.file', 'file');
      qb.leftJoinAndSelect('ChatMessageEntity.owner', 'owner');
      qb.leftJoinAndSelect('owner.cover', 'owner_cover');
    }

    return qb;
  }
}
