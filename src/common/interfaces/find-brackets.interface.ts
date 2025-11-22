import { FindManyOptions, FindOneOptions } from 'typeorm';

import { CustomExtendedOptions } from '../dto/custom-extended-options';

/**
 * [description]
 */
export interface FindManyBracketsOptions<Entity = any>
  extends FindManyOptions<Entity>,
    CustomExtendedOptions {
  /**
   * [description]
   */
  alias?: string;

  /**
   * [description]
   */
  asc?: string[];

  /**
   * [description]
   */
  desc?: string[];

  /**
   * [description]
   */
  selection?: string[];

  /**
   * [description]
   */
  joinRelations?: string[];

  /**
   * [description]
   */
  excludeRelations?: string[];

  /**
   * [description]
   */
  whereBrackets?: FindOneOptions['where'];

  /**
   * [description]
   */
  isManyOptions?: boolean;
}

/**
 * [description]
 */
export interface FindOneBracketsOptions<Entity = any>
  extends FindOneOptions<Entity>,
    CustomExtendedOptions {
  /**
   * [description]
   */
  selection?: string[];

  /**
   * [description]
   */
  eager?: boolean;

  /**
   * [description]
   */
  joinRelations?: string[];

  /**
   * [description]
   */
  excludeRelations?: string[];

  /**
   * [description]
   */
  whereBrackets?: FindOneOptions['where'];
}
