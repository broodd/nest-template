import { QueuesStatusEnum } from '../enums';

/**
 * [description]
 */
export interface CommonQueueJobPayloadInterface {
  /**
   * [description]
   */
  readonly status: QueuesStatusEnum;

  /**
   * [description]
   */
  readonly createdAt: Date;

  /**
   * [description]
   */
  readonly updatedAt: Date;
}
