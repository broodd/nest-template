import { FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * [description]
 */
export interface FindManyBracketsOptions<Entity = any> extends FindManyOptions<Entity> {
  /**
   * [description]
   */
  whereBrackets?: FindOneOptions['where'];

  /**
   * [description]
   */
  userId?: string;
}

/**
 * [description]
 */
export interface FindOneBracketsOptions<Entity = any> extends FindOneOptions<Entity> {
  /**
   * [description]
   */
  userId?: string;
}
