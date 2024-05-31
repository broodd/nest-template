import { ConflictException, NotFoundException, Type } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import {
  SelectQueryBuilder,
  FindOptionsWhere,
  FindOptionsUtils,
  FindManyOptions,
  FindOneOptions,
  EntityManager,
  DeepPartial,
  Repository,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { setQueryOrder } from '../helpers';
import { CommonEntity } from '../entities';

/**
 * [description]
 */
export class CommonService<EntityClass extends CommonEntity, PaginationClass> {
  /**
   * [description]
   * @param entityClass
   * @param repository
   * @param paginationClass
   */
  constructor(
    public readonly entityClass: Type<EntityClass>,
    public readonly repository: Repository<EntityClass>,
    public readonly paginationClass: Type<PaginationClass>,
  ) {}

  /**
   * [description]
   * @param entitiesLike
   * @param entityManager
   */
  public async createMany(
    entitiesLike: DeepPartial<EntityClass>[],
    entityManager?: EntityManager,
  ): Promise<EntityClass[]> {
    return this.repository.manager.transaction(async (runEntityManager) => {
      const transactionalEntityManager = entityManager || runEntityManager;

      const entities = this.repository.create(entitiesLike);
      return transactionalEntityManager.save(entities).catch(() => {
        throw new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
      });
    });
  }

  /**
   * [description]
   * @param entityLike
   * @param entityManager
   */
  public async createOne(
    entityLike: DeepPartial<EntityClass>,
    entityManager?: EntityManager,
  ): Promise<EntityClass> {
    const { id } = await this.repository.manager.transaction(async (runEntityManager) => {
      const transactionalEntityManager = entityManager || runEntityManager;

      const entity = this.repository.create(entityLike);
      return transactionalEntityManager.save(entity).catch((error) => {
        throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
      });
    });
    return this.selectOne(
      { id } as FindOptionsWhere<EntityClass>,
      { loadEagerRelations: true },
      entityManager,
    );
  }

  /**
   * [description]
   * @param optionsOrConditions
   * @param entityManager
   */
  public find(
    optionsOrConditions: FindManyOptions<EntityClass> = {},
    entityManager?: EntityManager,
  ): SelectQueryBuilder<EntityClass> {
    const metadata = this.repository.metadata;
    const alias =
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name;

    const qb = entityManager
      ? entityManager.createQueryBuilder(this.entityClass, alias)
      : this.repository.createQueryBuilder(alias);

    qb.setFindOptions(optionsOrConditions);

    /**
     * To add order by like `__custom` fields
     */
    setQueryOrder(qb, optionsOrConditions['asc'], 'ASC');
    setQueryOrder(qb, optionsOrConditions['desc'], 'DESC');

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('Entity.relation_field', 'Entity_relation_field')
       */
    }

    return qb;
  }

  /**
   * [description]
   * @param options
   * @param entityManager
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<EntityClass> = { loadEagerRelations: false },
    entityManager?: EntityManager,
  ): Promise<PaginationClass> {
    const qb = this.find(options, entityManager);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);
    return Promise.all([qb.getMany(), qb.getCount()])
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param options
   * @param entityManager
   */
  public async selectMany(
    options: FindManyBracketsOptions<EntityClass> = { loadEagerRelations: false },
    entityManager?: EntityManager,
  ): Promise<EntityClass[]> {
    const qb = this.find(options, entityManager);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);
    return qb.getMany().catch((error) => {
      throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   * @param entityManager
   */
  public async selectOne(
    conditions: FindOneOptions<EntityClass>['where'],
    options: FindOneOptions<EntityClass> = { loadEagerRelations: false },
    entityManager?: EntityManager,
  ): Promise<EntityClass> {
    return this.find({ ...instanceToPlain(options), where: conditions }, entityManager)
      .getOneOrFail()
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOne(
    conditions: FindOneOptions<EntityClass>['where'],
    entityLike: DeepPartial<EntityClass>,
    entityManager?: EntityManager,
  ): Promise<EntityClass> {
    const { id } = await this.repository.manager.transaction(async (runEntityManager) => {
      const transactionalEntityManager = entityManager || runEntityManager;

      const mergeIntoEntity = await this.selectOne(
        conditions,
        { loadEagerRelations: false },
        transactionalEntityManager,
      );
      const entity = this.repository.merge(mergeIntoEntity, entityLike);
      return transactionalEntityManager.save(entity).catch((error) => {
        throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
      });
    });
    return this.selectOne(
      { id } as FindOptionsWhere<EntityClass>,
      { loadEagerRelations: true },
      entityManager,
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateOneAndSelect(
    conditions: FindOneOptions<EntityClass>['where'],
    entityLike: DeepPartial<EntityClass>,
    entityManager?: EntityManager,
  ): Promise<EntityClass> {
    const { id } = await this.updateOne(conditions, entityLike, entityManager);
    return this.selectOne(
      { id } as FindOptionsWhere<EntityClass>,
      { loadEagerRelations: true },
      entityManager,
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  public async deleteOne(
    conditions: FindOneOptions<EntityClass>['where'],
    entityManager?: EntityManager,
  ): Promise<EntityClass> {
    return this.repository.manager.transaction(async (runEntityManager) => {
      const transactionalEntityManager = entityManager || runEntityManager;

      const entity = await this.selectOne(
        conditions,
        { loadEagerRelations: false },
        transactionalEntityManager,
      );
      return transactionalEntityManager.remove(entity).catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
    });
  }

  /**
   * [description]
   * @param entity
   */
  public fromEntityToRaw<T>(entity: T): Record<string, any> {
    return Object.entries(entity).reduce((acc, [key, value]) => {
      const property = this.entityClass.name + '_' + key;
      acc[property] = value;
      return acc;
    }, {});
  }

  /**
   * [description]
   * @param raw
   */
  public fromRawToEntity(raw: any): Record<string, any> {
    return Object.entries(raw).reduce((acc, [key, value]) => {
      const splited = key.split('_');
      splited.reduce((field, el, index) => {
        if (index === 0) return acc;
        if (index === splited.length - 1) field[el] = value;
        else if (field[el] === undefined) field[el] = {};
        return field[el];
      }, {});

      return acc;
    }, {});
  }
}
