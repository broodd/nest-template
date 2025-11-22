import { SelectQueryBuilder, Repository } from 'typeorm';
import { Stringifier, stringify } from 'csv-stringify';
import { plainToInstance } from 'class-transformer';

import { NotFoundException, Type } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { CommonEntity } from '../entities';

import { CommonService } from './common.service';

/**
 * [description]
 */
export class CommonWithCSV_Service<
  EntityClass extends CommonEntity,
  PaginationClass,
> extends CommonService<EntityClass, PaginationClass> {
  /**
   * [description]
   * @param entityClass
   * @param repository
   * @param paginationClass
   * @param errorPrefix
   */
  constructor(
    public readonly entityClass: Type<EntityClass>,
    public readonly repository: Repository<EntityClass>,
    public readonly paginationClass: Type<PaginationClass>,
    public readonly errorPrefix: string = '',
  ) {
    super(entityClass, repository, paginationClass, errorPrefix);
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
   * @param fields
   * @param qb
   */
  public async exportByStream<T, U>(fields: T, qb: SelectQueryBuilder<U>): Promise<Stringifier> {
    const columns = Object.entries(fields);
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
