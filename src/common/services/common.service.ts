import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ConflictException, NotFoundException, Type } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Stringifier, stringify } from 'csv-stringify';
import { Transactional } from 'typeorm-transactional';
import {
  SelectQueryBuilder,
  FindOptionsWhere,
  FindOptionsUtils,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  Repository,
} from 'typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { ErrorTypeEnum } from 'src/common/enums';

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
   */
  @Transactional()
  public async createMany(entitiesLike: DeepPartial<EntityClass>[]): Promise<EntityClass[]> {
    const entities = this.repository.create(entitiesLike);
    return this.repository.save(entities).catch(() => {
      throw new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
    });
  }

  /**
   * [description]
   * @param entityLike
   */
  @Transactional()
  public async createOne(entityLike: DeepPartial<EntityClass>): Promise<EntityClass> {
    const entity = this.repository.create(entityLike);
    return this.repository.save(entity).catch((error) => {
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
    });
  }

  /**
   * [description]
   * @param entityLike
   */
  @Transactional()
  public async createOneAndSelect(entityLike: DeepPartial<EntityClass>): Promise<EntityClass> {
    const { id } = await this.createOne(entityLike);
    return this.selectOne({ id } as FindOptionsWhere<EntityClass>, { loadEagerRelations: true });
  }

  /**
   * [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions: FindManyOptions<EntityClass> = {},
  ): SelectQueryBuilder<EntityClass> {
    const metadata = this.repository.metadata;
    const alias =
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name;
    const qb = this.repository.createQueryBuilder(alias);

    qb.setFindOptions(optionsOrConditions);

    /**
     * To add order by like `__custom` fields
     */
    setQueryOrder(qb, optionsOrConditions['asc'], 'ASC');
    setQueryOrder(qb, optionsOrConditions['desc'], 'DESC');

    if (optionsOrConditions.loadEagerRelations !== false) {
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
   */
  public async selectManyAndCount(
    options: FindManyBracketsOptions<EntityClass> = { loadEagerRelations: false },
  ): Promise<PaginationClass> {
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);
    return qb
      .getManyAndCount()
      .then((data) => new this.paginationClass(data))
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param options
   */
  public async selectMany(
    options: FindManyBracketsOptions<EntityClass> = { loadEagerRelations: false },
  ): Promise<EntityClass[]> {
    const qb = this.find(options);
    if (options.whereBrackets) qb.andWhere(options.whereBrackets);
    return qb.getMany().catch((error) => {
      throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindManyBracketsOptions<EntityClass>['where'],
    options: FindOneOptions<EntityClass> = { loadEagerRelations: false },
  ): Promise<EntityClass> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch((error) => {
        throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   */
  @Transactional()
  public async updateOne(
    conditions: FindOneOptions<EntityClass>['where'],
    entityLike: DeepPartial<EntityClass>,
  ): Promise<EntityClass> {
    const mergeIntoEntity = await this.selectOne(conditions, { loadEagerRelations: false });
    const entity = this.repository.merge(mergeIntoEntity, entityLike);
    return this.repository.save(entity).catch((error) => {
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   */
  @Transactional()
  public async updateOneAndSelect(
    conditions: FindOneOptions<EntityClass>['where'],
    entityLike: DeepPartial<EntityClass>,
  ): Promise<EntityClass> {
    const { id } = await this.updateOne(conditions, entityLike);
    return this.selectOne({ id } as FindOptionsWhere<EntityClass>, { loadEagerRelations: true });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   */
  @Transactional()
  public async update(
    conditions: FindOptionsWhere<EntityClass>,
    entityLike: QueryDeepPartialEntity<EntityClass>,
  ): Promise<number> {
    return this.repository
      .createQueryBuilder()
      .update()
      .set(entityLike)
      .where(conditions)
      .execute()
      .then((data) => data.affected)
      .catch(() => {
        throw new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
      });
  }

  /**
   * [description]
   * @param conditions
   */
  @Transactional()
  public async deleteOne(conditions: FindOneOptions<EntityClass>['where']): Promise<EntityClass> {
    const entity = await this.selectOne(conditions, { loadEagerRelations: false });
    return this.repository.remove(entity).catch((error) => {
      throw new NotFoundException({ message: ErrorTypeEnum.NOT_FOUND_ERROR, error });
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
        if (el === '') el = '_';
        if (index === 0) return acc;
        if (index === splited.length - 1) field[el] = value;
        else if (field[el] === undefined) field[el] = {};
        return field[el];
      }, {});

      return acc;
    }, {});
  }

  /**
   * [description]
   * @param mockFields
   * @param qb
   */
  public async streamExportCSV<T, U>(
    mockFields: T,
    qb: SelectQueryBuilder<U>,
  ): Promise<Stringifier> {
    const columns = Object.entries(mockFields);
    const qbStream = await qb.stream().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
    });

    const stringifier = stringify({
      bom: true,
      header: true,
      delimiter: ';',
      cast: { date: (value) => new Date(value).toUTCString() },
      columns: columns.map(([exportKey, dbKey]) => ({
        header: exportKey,
        key: dbKey,
      })),
    });

    qbStream
      .on('data', (raw) => {
        const data = this.fromRawToEntity(raw);
        const entity = plainToInstance(this.entityClass, data);
        return stringifier.write(entity);
      })
      .on('error', (error) => {
        console.error(error);
        stringifier.end();
        throw new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
      })
      .on('end', () => stringifier.end());

    return stringifier;
  }
}
