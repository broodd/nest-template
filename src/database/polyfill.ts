/* eslint-disable @typescript-eslint/ban-ts-comment */
import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';
import { SelectQueryBuilder } from 'typeorm';

/**
 * [description]
 * @link https://pietrzakadrian.com/blog/virtual-column-solutions-for-typeorm#5-decorator-method
 */
declare module 'typeorm' {
  /**
   * [description]
   */
  interface SelectQueryBuilder<Entity> {
    /**
     * [description]
     */
    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[] | undefined>;

    /**
     * [description]
     */
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;

    /**
     * [description]
     */
    // @ts-ignore
    executeEntitiesAndRawResults(): Promise<{ entities: Entity[]; raw: any[] }>;
  }
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (!raw.length) return entities;

  const idKey = Object.keys(raw[0])[0];
  const items = entities.map((entity) => {
    try {
      const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};

      const item = raw.find((el) => el[idKey] === entity.id);

      for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
        entity[propertyKey] = item[name];
      }
    } catch {}

    return entity;
  });

  return items.slice();
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  try {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entities[0][propertyKey] = raw[0][name];
    }
  } catch {}

  return entities[0];
};

/**
 * Polyfill getManyAndCount function with using decorator @VirtualColumn
 */
// @ts-ignore
const originExecute = SelectQueryBuilder.prototype.executeEntitiesAndRawResults;
// @ts-ignore
SelectQueryBuilder.prototype.executeEntitiesAndRawResults = async function (queryRunner) {
  const { entities, raw } = await originExecute.call(this, queryRunner);
  entities.forEach((entity, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entity[propertyKey] = item[name];
    }
  });
  return { entities, raw };
};
