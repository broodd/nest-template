import { IsEmail, IsIn } from 'class-validator';

import { TemplateNameKeys } from '../enums';

/**
 * [description]
 */
export class SelectTemplateDto {
  /**
   * [description]
   */
  @IsEmail()
  public readonly email: string;

  /**
   * [description]
   */
  @IsIn(TemplateNameKeys)
  public readonly template: string;
}
