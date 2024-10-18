import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { ChatEntity, ChatMessageEntity } from '../entities';
import { PaginationChatsDto } from '../dto';

/**
 * [description]
 */
@Injectable()
export class ChatsService extends CommonService<ChatEntity, PaginationChatsDto> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(ChatEntity)
    public readonly repository: Repository<ChatEntity>,
  ) {
    super(ChatEntity, repository, PaginationChatsDto);
  }

  /**
   * Join partial columns of last message
   * @param qb
   */
  public selectLastMessageQuery = (
    qb: SelectQueryBuilder<ChatMessageEntity>,
  ): SelectQueryBuilder<ChatMessageEntity> => {
    const columns = this.repository.manager
      .getRepository(ChatMessageEntity)
      .metadata.columns.map((el) => el.databaseName);

    qb.select(
      `JSON_BUILD_OBJECT(${columns.map((c) => `'${c}', ChatMessageEntity.${c}`).join(', ')})`,
    )
      .from(ChatMessageEntity, 'ChatMessageEntity')
      .where('ChatMessageEntity.chatId = ChatEntity.id')
      .orderBy('ChatMessageEntity.createdAt', 'DESC')
      .limit(1);

    return qb;
  };

  /**
   * [description]
   * @param options
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<ChatEntity> = { loadEagerRelations: false },
  ): Promise<PaginationChatsDto> {
    const qb = this.find(options).andWhere(options.whereBrackets);
    const userId = options.userId;

    qb.addSelect((sub) => {
      return sub
        .select('COUNT(ChatMessageEntity.id)')
        .from(ChatMessageEntity, 'ChatMessageEntity')
        .andWhere('ChatMessageEntity.chatId = ChatEntity.id')
        .andWhere('ChatMessageEntity.readAt IS NULL')
        .andWhere('ChatMessageEntity.ownerId != :userId', { userId });
    }, '__new_messages_count');

    qb.addSelect(this.selectLastMessageQuery, 'lastMessage');

    /**
     * Join current user
     */
    qb.innerJoin(
      'ChatEntity.participants',
      'participant_owner',
      'participant_owner.userId = :userId',
      { userId },
    );

    /**
     * Join other user with cover
     */
    qb.leftJoinAndMapOne(
      'ChatEntity.participant',
      'ChatEntity.participants',
      'participant_other',
      'participant_other.userId != :userId',
    );
    qb.innerJoinAndSelect('participant_other.user', 'participant_other_user');
    qb.leftJoinAndSelect('participant_other_user.cover', 'participant_other_user_cover');

    /**
     * Order by active or/and udatedAt
     */
    const activeChatId = options['activeChatId'];
    if (activeChatId)
      qb.addSelect(
        `(CASE "ChatEntity"."id" WHEN '${activeChatId}' THEN 1 ELSE 0 END)`,
        'is_active',
      ).orderBy('is_active', 'DESC');
    qb.addOrderBy('ChatEntity.updatedAt', 'DESC');

    return qb
      .getManyAndCount()
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOneWithOwner(
    conditions: FindOptionsWhere<ChatEntity>,
    options: FindManyBracketsOptions<ChatEntity> = { loadEagerRelations: true },
  ): Promise<ChatEntity> {
    const qb = this.find({ ...instanceToPlain(options), where: conditions });
    const userId = options.userId;

    qb.addSelect((sub) => {
      return sub
        .select('COUNT(ChatMessageEntity.id)')
        .from(ChatMessageEntity, 'ChatMessageEntity')
        .andWhere('ChatMessageEntity.chatId = ChatEntity.id')
        .andWhere('ChatMessageEntity.readAt IS NULL')
        .andWhere('ChatMessageEntity.ownerId != :userId', { userId });
    }, '__new_messages_count');

    qb.addSelect(this.selectLastMessageQuery, 'lastMessage');

    qb.leftJoinAndMapOne(
      'ChatEntity.participant',
      'ChatEntity.participants',
      'participant_owner',
      'participant_owner.userId = :userId',
      { userId },
    )
      .innerJoinAndSelect('participant_owner.user', 'participant_owner_user')
      .leftJoinAndSelect('participant_owner_user.cover', 'participant_owner_user_cover');

    return qb.getOneOrFail().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.CHAT_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param participantIds
   */
  public async selectOneByParticipants(participantIds: string[]): Promise<Partial<ChatEntity>> {
    return this.find()
      .select('ChatEntity.id')
      .innerJoin(
        'ChatEntity.participants',
        'ChatEntity_participants',
        'ChatEntity_participants.userId IN (:...participantIds)',
        { participantIds },
      )
      .having(`ARRAY_LENGTH(ARRAY_AGG(ChatEntity_participants.userId), 1) >= :participantsLength`, {
        participantsLength: participantIds.length,
      })
      .groupBy('ChatEntity.id')
      .getOne();
  }
}
