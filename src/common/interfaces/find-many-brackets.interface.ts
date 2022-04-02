import { Brackets, FindManyOptions } from 'typeorm';

/**
 * [description]
 */
export interface FindManyBracketsOptions<Entity = any> extends FindManyOptions<Entity> {
  /**
   * [description]
   */
  whereBrackets?: Brackets;
}
