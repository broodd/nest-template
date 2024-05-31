import { FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * [description]
 */
export interface FindManyBracketsOptions<Entity = any> extends FindManyOptions<Entity> {
  /**
   * [description]
   */
  whereBrackets?: FindOneOptions['where'];
}
