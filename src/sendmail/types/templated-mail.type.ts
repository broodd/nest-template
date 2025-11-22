import { ISendMailOptions } from '@nestjs-modules/mailer';

import { TemplateSubjectEnum, TemplateNameEnum } from '../enums';

/**
 * [description]
 */
export type MailType = Pick<Required<ISendMailOptions>, 'subject'> &
  Omit<ISendMailOptions, 'to'> & {
    to: string[];
    template: TemplateNameEnum;
  };

/**
 * [description]
 */
export type BaseLayoutOptionsType = {
  template?: TemplateNameEnum;
  subject?: TemplateSubjectEnum;

  title: string;
  name?: string;
  text: string;

  buttonText?: string;
  buttonUrl?: string;
};
