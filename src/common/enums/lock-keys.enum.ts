/**
 * [description]
 */
export const LOCK_PREFIX = 'LOCK:';

/**
 * [description]
 */
export enum LockStatusEnum {
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}

/**
 * [description]
 */
export enum LockKeysEnum {
  COMMODITIES_CATALOG = 'commodities_catalog',
  SUBCATEGORIES_CATALOG = 'subcategories_catalog',
  CATEGORIES_CATALOG = 'categories_catalog',
  SUPPLIERS = 'suppliers',
  REQUESTS = 'requests',
  USERS = 'users',
}
