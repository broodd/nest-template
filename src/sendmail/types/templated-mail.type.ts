import { ISendMailOptions } from '@nestjs-modules/mailer';

import { TemplateNameEnum } from '../enums';

/**
 * [description]
 */
export type TemplatedMailType = Pick<Required<ISendMailOptions>, 'to' | 'subject' | 'context'> &
  ISendMailOptions & {
    template: TemplateNameEnum;
  };

/**
 * [description]
 */
export type TemplatedMailConfirmationType = TemplatedMailType & {
  template: TemplateNameEnum.CONFIRMATION;
  context: {
    CODE: string;
    URL: string;
  };
};

/**
 * [description]
 */
export type TemplatedMailResetPasswordType = TemplatedMailType & {
  template: TemplateNameEnum.RESET_PASSWORD;
  context: {
    CODE: string;
    URL: string;
  };
};
