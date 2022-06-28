import { NotFoundException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import {
  SelectQueryBuilder,
  FindOptionsUtils,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  SaveOptions,
  Repository,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { PaginationChatParticipantsDto, PaginationChatsDto } from '../dto';
import { ChatEntity, ChatParticipantEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class ChatParticipantsService {
  /**
   * [description]
   * @param chatParticipantEntityRepository
   */
  constructor(
    @InjectRepository(ChatParticipantEntity)
    private readonly chatParticipantEntityRepository: Repository<ChatParticipantEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<ChatParticipantEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<ChatParticipantEntity> {
    return this.chatParticipantEntityRepository.manager.transaction(async () => {
      const entity = this.chatParticipantEntityRepository.create(entityLike);
      const { id } = await this.chatParticipantEntityRepository
        .save(entity, options)
        .catch((err) => {
          console.log(err);
          throw new ConflictException(ErrorTypeEnum.CHAT_PARTICIPANT_ALREADY_EXIST);
        });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<ChatParticipantEntity>,
  ): SelectQueryBuilder<ChatParticipantEntity> {
    const metadata = this.chatParticipantEntityRepository.metadata;
    const qb = this.chatParticipantEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('ChatParticipantEntity.relation_field', 'ChatParticipantEntity_relation_field')
       */
    }

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectIds(
    options: FindManyOptions<ChatParticipantEntity> = {
      loadEagerRelations: false,
      select: ['userId'],
    },
  ): Promise<string[]> {
    return this.find(classToPlain(options))
      .getMany()
      .then((data) => data.map((value) => value.userId))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANTS_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<ChatParticipantEntity> = { loadEagerRelations: false },
  ): Promise<PaginationChatsDto> {
    return this.find(classToPlain(options))
      .getManyAndCount()
      .then((data) => new PaginationChatParticipantsDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANTS_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<ChatParticipantEntity>,
    options: FindOneOptions<ChatParticipantEntity> = { loadEagerRelations: false },
  ): Promise<ChatParticipantEntity> {
    return this.find({ ...classToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANT_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param participantIds
   */
  public async selectOneByParticipants(participantIds: string[]): Promise<Partial<ChatEntity>> {
    return this.chatParticipantEntityRepository
      .createQueryBuilder('ChatParticipantEntity')
      .select('ChatParticipantEntity.chatId', 'id')
      .andWhere('ChatParticipantEntity.userId IN (:...participantIds)', { participantIds })
      .having(
        `ARRAY_LENGTH(ARRAY_AGG(ChatParticipantEntity.userId), 1) >= ${participantIds.length}`,
      )
      .groupBy('ChatParticipantEntity.chatId')
      .getRawOne();
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: FindOptionsWhere<ChatParticipantEntity>,
    entityLike: Partial<ChatParticipantEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<ChatParticipantEntity> {
    return this.chatParticipantEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.chatParticipantEntityRepository.merge(mergeIntoEntity, entityLike);
      return this.chatParticipantEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.CHAT_PARTICIPANT_ALREADY_EXIST);
      });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(
    conditions: FindOptionsWhere<ChatParticipantEntity>,
    options: RemoveOptions = { transaction: false },
  ): Promise<ChatParticipantEntity> {
    return this.chatParticipantEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOne(conditions, options);
      return this.chatParticipantEntityRepository.remove(entity).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANT_NOT_FOUND);
      });
    });
  }
}
