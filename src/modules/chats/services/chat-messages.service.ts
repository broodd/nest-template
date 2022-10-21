import { NotFoundException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import {
  SelectQueryBuilder,
  FindOptionsUtils,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  EntityManager,
  Repository,
  Not,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from 'src/modules/users/entities';

import { ChatEntity, ChatMessageEntity, ChatParticipantEntity } from '../entities';
import { PaginationChatMessagesDto, PaginationChatsDto } from '../dto';
import { ChatMessageStatusEnum } from '../enums';
import { ChatsService } from './chats.service';

/**
 * [description]
 */
@Injectable()
export class ChatMessagesService {
  /**
   * [description]
   * @param chatMessageEntityRepository
   * @param chatsService
   */
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageEntityRepository: Repository<ChatMessageEntity>,
    private readonly chatsService: ChatsService,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: Partial<ChatMessageEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatMessageEntity> {
    const { id } = await this.chatMessageEntityRepository.manager.transaction(
      async (chatMessageEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : chatMessageEntityManager;

        const entity = this.chatMessageEntityRepository.create(entityLike);
        const saved = await transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.CHAT_MESSAGE_ALREADY_EXIST);
        });

        await this.chatsService.update(
          { id: entityLike.chat.id },
          { lastMessage: { id } },
          transactionalEntityManager,
        );
        return saved;
      },
    );
    return this.selectOne({ id }, { loadEagerRelations: true });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<ChatMessageEntity>,
  ): SelectQueryBuilder<ChatMessageEntity> {
    const metadata = this.chatMessageEntityRepository.metadata;
    const qb = this.chatMessageEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('ChatMessageEntity.relation_field', 'ChatMessageEntity_relation_field')
       */

      qb.leftJoinAndSelect('ChatMessageEntity.reply', 'ChatMessageEntity_reply');
      qb.leftJoinAndSelect('ChatMessageEntity_reply.file', 'ChatMessageEntity_reply_file');
      qb.leftJoinAndSelect('ChatMessageEntity_reply.owner', 'ChatMessageEntity_reply_owner');
      qb.leftJoinAndSelect(
        'ChatMessageEntity_reply_owner.cover',
        'ChatMessageEntity_reply_owner_cover',
      );
      qb.leftJoinAndSelect('ChatMessageEntity.owner', 'ChatMessageEntity_owner');
      qb.leftJoinAndSelect('ChatMessageEntity_owner.cover', 'ChatMessageEntity_owner_cover');
    }

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   * @param chat
   * @param user
   */
  public async selectAll(
    options: FindManyOptions<ChatMessageEntity> = { loadEagerRelations: false },
    chat: Partial<ChatEntity>,
    user: Partial<UserEntity>,
  ): Promise<PaginationChatsDto> {
    const [rows, count] = await this.find(instanceToPlain(options))
      .andWhere({ chat })
      .getManyAndCount()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_MESSAGES_NOT_FOUND);
      });

    await this.updateAll(
      {
        status: ChatMessageStatusEnum.SENT,
        owner: { id: Not(user.id) },
        chat: { id: chat.id },
      },
      { status: ChatMessageStatusEnum.READ },
    );

    return new PaginationChatMessagesDto([rows.reverse(), count]);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<ChatMessageEntity>,
    options: FindOneOptions<ChatMessageEntity> = { loadEagerRelations: false },
  ): Promise<ChatMessageEntity> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param user
   */
  public async selectNewMessagesCount(user: Partial<UserEntity>): Promise<number> {
    return this.chatMessageEntityRepository
      .createQueryBuilder()
      .innerJoin(
        ChatParticipantEntity,
        'ChatParticipantEntity',
        'ChatParticipantEntity.chatId = ChatMessageEntity.chatId AND ChatParticipantEntity.userId = :userId',
        { userId: user.id },
      )
      .where({
        status: ChatMessageStatusEnum.SENT,
        owner: { id: Not(user.id) },
      })
      .getCount()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateAll(
    conditions: FindOptionsWhere<ChatMessageEntity>,
    entityLike: Partial<ChatMessageEntity>,
    entityManager?: EntityManager,
  ): Promise<number> {
    return this.chatMessageEntityRepository.manager.transaction(
      async (chatMessageEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : chatMessageEntityManager;

        return transactionalEntityManager
          .update(ChatMessageEntity, conditions, entityLike)
          .then((data) => data.affected)
          .catch(() => {
            throw new ConflictException(ErrorTypeEnum.CHAT_MESSAGE_ALREADY_EXIST);
          });
      },
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOptionsWhere<ChatMessageEntity>,
    entityLike: Partial<ChatMessageEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageEntityRepository.manager.transaction(
      async (chatMessageEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : chatMessageEntityManager;

        const mergeIntoEntity = await this.selectOne(conditions);
        const entity = this.chatMessageEntityRepository.merge(mergeIntoEntity, entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.CHAT_MESSAGE_ALREADY_EXIST);
        });
      },
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  public async deleteOne(
    conditions: FindOptionsWhere<ChatMessageEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageEntityRepository.manager.transaction(
      async (chatMessageEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : chatMessageEntityManager;

        const entity = await this.selectOne(conditions);
        return transactionalEntityManager.remove(entity).catch(() => {
          throw new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);
        });
      },
    );
  }
}
