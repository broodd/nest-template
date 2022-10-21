import { NotFoundException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import {
  SelectQueryBuilder,
  FindOptionsWhere,
  FindOptionsUtils,
  FindManyOptions,
  FindOneOptions,
  EntityManager,
  Repository,
  In,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from 'src/modules/users/entities';

import { PaginationChatsDto, SelectChatsDto } from '../dto';
import { ChatMessageStatusEnum } from '../enums';
import { ChatEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class ChatsService {
  /**
   * [description]
   * @param chatEntityRepository
   */
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatEntityRepository: Repository<ChatEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: Partial<ChatEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatEntity> {
    const { id } = await this.chatEntityRepository.manager.transaction(
      async (chatEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : chatEntityManager;

        const entity = this.chatEntityRepository.create(entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.CHAT_ALREADY_EXIST);
        });
      },
    );
    return this.selectOne({ id }, { loadEagerRelations: true });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(optionsOrConditions?: FindManyOptions<ChatEntity>): SelectQueryBuilder<ChatEntity> {
    const metadata = this.chatEntityRepository.metadata;
    const qb = this.chatEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('ChatEntity.relation_field', 'ChatEntity_relation_field')
       */
    }

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async selectAllStats(
    data: ChatEntity[],
    user: Partial<UserEntity>,
  ): Promise<ChatEntity[]> {
    const stats: Record<string, ChatEntity> = await this.find({ loadEagerRelations: false })
      .select('ChatEntity.id', 'id')
      .addSelect('COUNT(ChatEntity_messages.id)::INT', 'newMessagesCount')
      .leftJoin(
        'ChatEntity.messages',
        'ChatEntity_messages',
        'ChatEntity_messages.status = :status AND ChatEntity_messages.ownerId != :ownerId',
        { status: ChatMessageStatusEnum.SENT, ownerId: user.id },
      )
      .groupBy('ChatEntity.id')
      .where({ id: In(data.map((row) => row.id)) })
      .getRawMany()
      .then((data) => data.reduce((acc, curr) => ((acc[curr.id] = curr), acc), {}));

    return data.map((row) => ((row.newMessagesCount = stats[row.id].newMessagesCount), row));
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async selectOneStats(
    data: ChatEntity,
    user: Partial<UserEntity>,
    equal = false,
  ): Promise<ChatEntity> {
    const qb = this.find({ loadEagerRelations: false })
      .select('ChatEntity.id', 'id')
      .addSelect('COUNT(ChatEntity_messages.id)::INT', 'newMessagesCount')
      .leftJoin(
        'ChatEntity.messages',
        'ChatEntity_messages',
        'ChatEntity_messages.status = :status',
        { status: ChatMessageStatusEnum.SENT, ownerId: user.id },
      )
      .groupBy('ChatEntity.id')
      .where({ id: data.id });

    equal
      ? qb.andWhere('ChatEntity_messages.ownerId = :ownerId')
      : qb.andWhere('ChatEntity_messages.ownerId != :ownerId');

    const stats: Partial<ChatEntity> = await qb.getRawOne();
    data.newMessagesCount = stats.newMessagesCount;
    return data;
  }

  /**
   * [description]
   * @param options
   * @param user
   */
  public async selectAll(
    options: SelectChatsDto,
    user: Partial<UserEntity>,
  ): Promise<PaginationChatsDto> {
    const { activeChatId } = options;
    const qb = this.find(instanceToPlain(options)).andWhere(options.whereBrackets);

    /**
     * Join last message
     */
    qb.leftJoinAndSelect('ChatEntity.lastMessage', 'ChatEntity_lastMessage');

    /**
     * Join current user
     */
    qb.innerJoin(
      'ChatEntity.participants',
      'ChatEntity_participant_owner',
      'ChatEntity_participant_owner.userId = :userId',
      { userId: user.id },
    );

    /**
     * Join other user with cover
     */
    qb.innerJoinAndMapOne(
      'ChatEntity.participant',
      'ChatEntity.participants',
      'ChatEntity_participant_other',
      'ChatEntity_participant_other.userId != :userId',
    )
      .innerJoinAndSelect('ChatEntity_participant_other.user', 'ChatEntity_participant_other_user')
      .leftJoinAndSelect(
        'ChatEntity_participant_other_user.cover',
        'ChatEntity_participant_other_user_cover',
      );

    /**
     * Order by active or/and udatedAt
     */
    if (activeChatId)
      qb.addSelect(
        `(CASE "ChatEntity"."id" WHEN '${activeChatId}' THEN 1 ELSE 0 END)`,
        'active',
      ).orderBy('active', 'DESC');
    qb.addOrderBy('ChatEntity.updatedAt', 'DESC');

    const [rows, count] = await qb.getManyAndCount().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.CHATS_NOT_FOUND);
    });
    return new PaginationChatsDto([await this.selectAllStats(rows, user), count]);
  }

  /**
   * [description]
   *
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<ChatEntity>,
    options: FindOneOptions<ChatEntity> = { loadEagerRelations: false },
  ): Promise<ChatEntity> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_NOT_FOUND);
      });
  }

  /**
   * [description]
   *
   * @param conditions
   * @param options
   */
  public async selectOneEager(
    conditions: FindOptionsWhere<ChatEntity>,
    user: Partial<UserEntity>,
    options: FindOneOptions<ChatEntity> = { loadEagerRelations: true },
  ): Promise<ChatEntity> {
    return (
      this.find({ ...instanceToPlain(options), where: conditions })
        /**
         * Join last message
         */
        .leftJoinAndSelect('ChatEntity.lastMessage', 'ChatEntity_lastMessage')
        /**
         * Join owner user with cover
         */
        .innerJoinAndMapOne(
          'ChatEntity.participant',
          'ChatEntity.participants',
          'ChatEntity_participant_owner',
          'ChatEntity_participant_owner.userId = :userId',
          { userId: user.id },
        )
        .innerJoinAndSelect(
          'ChatEntity_participant_owner.user',
          'ChatEntity_participant_owner_user',
        )
        .leftJoinAndSelect(
          'ChatEntity_participant_owner_user.cover',
          'ChatEntity_participant_owner_user_cover',
        )
        .getOneOrFail()
        .then((data) => this.selectOneStats(data, user, true))
        .catch(() => {
          throw new NotFoundException(ErrorTypeEnum.CHAT_NOT_FOUND);
        })
    );
  }

  /**
   * [description]
   * @param participantIds
   */
  public async selectOneByParticipants(participantIds: string[]): Promise<ChatEntity> {
    return this.chatEntityRepository
      .createQueryBuilder('ChatEntity')
      .select('ChatEntity.id')
      .innerJoin(
        'ChatEntity.participants',
        'ChatEntity_participants',
        'ChatEntity_participants.userId IN (:...participantIds)',
        { participantIds },
      )
      .having(
        `ARRAY_LENGTH(ARRAY_AGG(ChatEntity_participants.userId), 1) >= ${participantIds.length}`,
      )
      .groupBy('ChatEntity.id')
      .getOne();
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOptionsWhere<ChatEntity>,
    entityLike: Partial<ChatEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatEntity> {
    return this.chatEntityRepository.manager.transaction(async (chatEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : chatEntityManager;

      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.chatEntityRepository.merge(mergeIntoEntity, entityLike);
      return transactionalEntityManager.save(entity).catch(() => {
        throw new ConflictException(ErrorTypeEnum.CHAT_ALREADY_EXIST);
      });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async update(
    conditions: FindOptionsWhere<ChatEntity>,
    entityLike: Partial<ChatEntity>,
    entityManager?: EntityManager,
  ): Promise<number> {
    return this.chatEntityRepository.manager.transaction(async (chatEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : chatEntityManager;

      return transactionalEntityManager
        .update(ChatEntity, conditions, entityLike)
        .then((data) => data.affected)
        .catch(() => {
          throw new ConflictException(ErrorTypeEnum.CHAT_ALREADY_EXIST);
        });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  public async deleteOne(
    conditions: FindOptionsWhere<ChatEntity>,
    entityManager?: EntityManager,
  ): Promise<ChatEntity> {
    return this.chatEntityRepository.manager.transaction(async (chatEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : chatEntityManager;

      const entity = await this.selectOne(conditions);
      return transactionalEntityManager.remove(entity).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_NOT_FOUND);
      });
    });
  }
}
