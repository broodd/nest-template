import { ISendMailOptions } from '@nestjs-modules/mailer';

import { CommonQueueJobPayloadInterface } from 'src/common/interfaces';
import { TemplateNameEnum } from '../enums';

/**
 * [description]
 */
export type MailPayloadType = Omit<ISendMailOptions, 'to'> &
  Partial<CommonQueueJobPayloadInterface> & {
    to: string | string[];
    template?: TemplateNameEnum;
  };
