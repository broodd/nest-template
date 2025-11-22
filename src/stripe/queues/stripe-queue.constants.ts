import { QueueConfigType } from 'src/common/queues/types';

import { StripeEventEnum } from '../enums';

/**
 * [description]
 */
export const STRIPE_QUEUE = {
  name: 'STRIPE_QUEUE',
  defaultJobOptions: {
    removeOnComplete: { age: 120 }, // 2 min
    removeOnFail: false,
  },
  events: {
    [StripeEventEnum.CHECKOUT_SESSION_COMPLETED]: {
      name: StripeEventEnum.CHECKOUT_SESSION_COMPLETED,
      options: {},
    },
  },
} as const satisfies QueueConfigType;
