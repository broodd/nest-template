import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import {
  Repository,
  EntityManager,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserNotificationTokenEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class UserNotificationTokensService {
  /**
   * [description]
   * @param userNotificationTokenEntityRepository
   */
  constructor(
    @InjectRepository(UserNotificationTokenEntity)
    public readonly userNotificationTokenEntityRepository: Repository<UserNotificationTokenEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: Partial<UserNotificationTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokenEntityRepository.manager.transaction(
      async (userNotificationTokenEntityManager) => {
        const transactionalEntityManager = entityManager
          ? entityManager
          : userNotificationTokenEntityManager;

        const entity = this.userNotificationTokenEntityRepository.create(entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_ALREADY_EXIST);
        });
      },
    );
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<UserNotificationTokenEntity>,
  ): SelectQueryBuilder<UserNotificationTokenEntity> {
    const metadata = this.userNotificationTokenEntityRepository.metadata;
    return this.userNotificationTokenEntityRepository
      .createQueryBuilder(
        FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
      )
      .setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<UserNotificationTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserNotificationTokenEntity[]> {
    const qb = this.find(instanceToPlain(options));
    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKENS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    options: FindOneOptions<UserNotificationTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserNotificationTokenEntity> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    entityLike: Partial<UserNotificationTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokenEntityRepository.manager.transaction(
      async (userNotificationTokenEntityManager) => {
        const transactionalEntityManager = entityManager
          ? entityManager
          : userNotificationTokenEntityManager;

        const mergeIntoEntity = await this.selectOne(conditions);
        const entity = this.userNotificationTokenEntityRepository.merge(
          mergeIntoEntity,
          entityLike,
        );
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_ALREADY_EXIST);
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
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokenEntityRepository.manager.transaction(
      async (userNotificationTokenEntityManager) => {
        const transactionalEntityManager = entityManager
          ? entityManager
          : userNotificationTokenEntityManager;

        const entity = await this.selectOne(conditions);
        return transactionalEntityManager.remove(entity).catch(() => {
          throw new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_NOT_FOUND);
        });
      },
    );
  }
}
