import { QueueConfigType } from 'src/common/queues/types';

/**
 * [description]
 */
export const SENDMAIL_QUEUE = {
  name: 'SENDMAIL_QUEUE',
  events: {
    sendMail: {
      name: 'SEND_MAIL_EVENT',
      options: {},
    },
  },
} as const satisfies QueueConfigType;
