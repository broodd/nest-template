import { ISendMailOptions } from '@nestjs-modules/mailer';

import { TemplateNameEnum, TemplateSubjectEnum } from '../enums';

/**
 * [description]
 */
export type MailType = Pick<Required<ISendMailOptions>, 'subject'> &
  Omit<ISendMailOptions, 'to'> & {
    to: string | string[];
    template: TemplateNameEnum;
  };

/**
 * [description]
 */
export type TemplatedMailResetPasswordType = MailType & {
  subject: TemplateSubjectEnum.RESET_PASSWORD;
  template: TemplateNameEnum.RESET_PASSWORD;
  context: {
    code: string;
    url: string;
  };
};
