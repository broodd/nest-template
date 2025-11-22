import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { UserEntity } from 'src/modules/users/entities';

import { TemplateSubjectEnum, TemplateNameEnum } from '../enums';
import { BaseLayoutOptionsType, MailType } from '../types';

@Injectable()
export class SendmailTemplateContextFactory {
  /**
   * [description]
   */
  public readonly serverURL = this.config.get('SERVER_URL');
  public readonly clientURL = this.config.get('CLIENT_URL');
  public readonly socials = {
    instagram: 'https://www.instagram.com/user',
  };

  /**
   * [description]
   * @param config
   */
  constructor(private readonly config: ConfigService) {}

  /**
   * [description]
   * @param context
   */
  public assignContext(context: MailType['context']): MailType['context'] {
    return Object.assign(
      {
        serverURL: this.serverURL,
        clientURL: this.clientURL,
        socials: this.socials,
      },
      context,
    );
  }

  /**
   * TemplateNameEnum.BASE_LAYOUT
   * @param user
   * @param code
   */
  public build_BASE_LAYOUT(user: UserEntity, options: BaseLayoutOptionsType): Partial<MailType> {
    return {
      to: [user.email],
      subject: options.subject,
      template: TemplateNameEnum.BASE_LAYOUT,
      context: this.assignContext({ user, ...options }),
    };
  }

  /**
   * TemplateNameEnum.RESET_PASSWORD
   * @param user
   * @param code
   */
  public build_RESET_PASSWORD(user: UserEntity, options: { code: string }): Partial<MailType> {
    const redirect = `${user.role.toLowerCase()}/auth/set-password`;
    const url = `${this.clientURL}/${redirect}?code=${options.code}&email=${user.email}`;

    return {
      to: [user.email],
      subject: TemplateSubjectEnum.RESET_PASSWORD,
      template: TemplateNameEnum.RESET_PASSWORD,
      context: this.assignContext({ user, url }),
    };
  }

  /**
   * TemplateNameEnum.SING_UP_CODE
   * @param user
   * @param code
   */
  public build_SING_UP_CODE(user: UserEntity, options: { code: string }): Partial<MailType> {
    const redirect = 'auth/sign-up-confirmaion';

    const url = `${this.clientURL}/${redirect}?code=${options.code}&email=${user.email}`;

    return {
      template: TemplateNameEnum.SING_UP_CODE,
      subject: TemplateSubjectEnum.SING_UP_CODE,
      to: [user.email],
      context: this.assignContext({ user, url }),
    };
  }
}
