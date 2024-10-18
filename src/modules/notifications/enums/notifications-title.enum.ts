import { template } from 'src/common/helpers';

/**
 * [description]
 * @example NotificationsTitleEnum.REMINDER({ name: 'drink water!' }) -> 'New reminder drink water!'
 */
export const NotificationsTitleEnum = {
  /**
   * @param name
   */
  REMINDER: template`New reminder ${'name'}`,
};
