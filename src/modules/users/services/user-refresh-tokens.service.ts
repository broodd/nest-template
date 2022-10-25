import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { randomBytes } from 'crypto';
import { hash } from 'src/common/helpers';
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

import { UserRefreshTokenEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class UserRefreshTokensService {
  /**
   * [description]
   */
  private readonly maxCountOfRefreshTokens = 10;

  /**
   * [description]
   * @param userRefreshTokenEntityRepository
   */
  constructor(
    @InjectRepository(UserRefreshTokenEntity)
    public readonly userRefreshTokenEntityRepository: Repository<UserRefreshTokenEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   */
  public async generateAndCreateOne(
    entityLike: Partial<UserRefreshTokenEntity>,
  ): Promise<UserRefreshTokenEntity> {
    const refreshIdentifier = randomBytes(16).toString('hex');
    const refreshHash = await hash(refreshIdentifier);
    const entity = await this.createOne({ ...entityLike, ppid: refreshHash });
    return { ...entity, ppid: refreshIdentifier };
  }

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: Partial<UserRefreshTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(async (userEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : userEntityManager;

      const entity = this.userRefreshTokenEntityRepository.create(entityLike);
      return transactionalEntityManager.save(entity).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_REFRESH_TOKEN_ALREADY_EXIST);
      });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<UserRefreshTokenEntity>,
  ): SelectQueryBuilder<UserRefreshTokenEntity> {
    const metadata = this.userRefreshTokenEntityRepository.metadata;
    return this.userRefreshTokenEntityRepository
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
    options: FindManyOptions<UserRefreshTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserRefreshTokenEntity[]> {
    const qb = this.find(instanceToPlain(options));
    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKENS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
    options: FindOneOptions<UserRefreshTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserRefreshTokenEntity> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKEN_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
    entityLike: Partial<UserRefreshTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(
      async (userRefreshTokenEntityManager) => {
        const transactionalEntityManager = entityManager
          ? entityManager
          : userRefreshTokenEntityManager;

        const mergeIntoEntity = await this.selectOne(conditions);
        const entity = this.userRefreshTokenEntityRepository.merge(mergeIntoEntity, entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.USER_REFRESH_TOKEN_ALREADY_EXIST);
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
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
    entityManager?: EntityManager,
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(
      async (userRefreshTokenEntityManager) => {
        const transactionalEntityManager = entityManager
          ? entityManager
          : userRefreshTokenEntityManager;

        const entity = await this.selectOne(conditions);
        return transactionalEntityManager.remove(entity).catch(() => {
          throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKEN_NOT_FOUND);
        });
      },
    );
  }

  /**
   * [description]
   * @param conditions
   */
  public async deleteOldRefreshTokens(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
  ): Promise<void> {
    const tokens = await this.userRefreshTokenEntityRepository.find({
      select: { id: true, createdAt: true },
      where: conditions,
      skip: this.maxCountOfRefreshTokens,
      order: { createdAt: 'DESC' },
    });
    if (tokens.length)
      await this.userRefreshTokenEntityRepository.delete(tokens.map((token) => token.id));
  }
}
