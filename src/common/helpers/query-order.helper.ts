import { SelectQueryBuilder } from 'typeorm';

/**
 * Helper for add order by custom property which starts with '__'
 * Custom property not contain in entity, so must order this way because in method qb.order() it's not working
 * @param qb
 * @param order
 * @param value
 */
export const setQueryOrder = <T>(
  qb: SelectQueryBuilder<T>,
  order: string[],
  value: 'ASC' | 'DESC',
): void => {
  order
    ?.filter((key) => key.startsWith('__'))
    .forEach((key) => qb.addOrderBy(key, value, 'NULLS LAST'));
};
