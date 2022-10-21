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

import { UserEntity } from '../entities';
import { PaginationUsersDto } from '../dto';

/**
 * [description]
 */
@Injectable()
export class UsersService {
  /**
   * [description]
   * @param userEntityRepository
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: Partial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity> {
    const { id } = await this.userEntityRepository.manager.transaction(
      async (userEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : userEntityManager;

        const entity = this.userEntityRepository.create(entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
        });
      },
    );
    return this.selectOne({ id }, { loadEagerRelations: true });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(optionsOrConditions?: FindManyOptions<UserEntity>): SelectQueryBuilder<UserEntity> {
    const metadata = this.userEntityRepository.metadata;
    const qb = this.userEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    /**
     * Place for add custom order
     * qb.addSelect('__custom') and then
     * order by it from property order from options
     * @example
     */
    /* if (optionsOrConditions.order)
      optionsOrConditions.order = setFindOrder(qb, optionsOrConditions.order); */

    /**
     * Place for common relation
     * @example
     */
    /* if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      qb.leftJoinAndSelect('Entity.relation_field', 'Entity_relation_field')
    } */

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<PaginationUsersDto> {
    return this.find(options)
      .getManyAndCount()
      .then((data) => new PaginationUsersDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USERS_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<UserEntity>,
    options: FindOneOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<UserEntity> {
    return this.find({
      ...instanceToPlain(options),
      where: conditions,
    })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOptionsWhere<UserEntity>,
    entityLike: Partial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity> {
    const { id } = await this.userEntityRepository.manager.transaction(
      async (userEntityManager) => {
        const transactionalEntityManager = entityManager ? entityManager : userEntityManager;

        const mergeIntoEntity = await this.selectOne(conditions);
        const entity = this.userEntityRepository.merge(mergeIntoEntity, entityLike);
        return transactionalEntityManager.save(entity).catch(() => {
          throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
        });
      },
    );
    return this.selectOne({ id }, { loadEagerRelations: true });
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  public async deleteOne(
    conditions: FindOptionsWhere<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async (userEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : userEntityManager;

      const entity = await this.selectOne(conditions);
      return transactionalEntityManager.remove(entity).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      });
    });
  }
}
