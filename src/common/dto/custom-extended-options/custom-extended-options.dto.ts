import { Allow } from 'class-validator';

import { ApiHideProperty } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/users/enums';

/**
 * [description]
 */
export interface CustomExtendedOptions {
  /**
   * [description]
   */
  _userId?: string;

  /**
   * [description]
   */
  _role?: UserRoleEnum;

  /**
   * [description]
   */
  _data?: Record<string, any>;
}

/**
 * [description]
 */
export class CustomExtendedOptionsDto implements CustomExtendedOptions {
  /**
   * Request userId
   */
  @Allow()
  @ApiHideProperty()
  public _userId?: string;

  /**
   * Request userId
   */
  @Allow()
  @ApiHideProperty()
  public _role?: UserRoleEnum;

  /**
   * Different useful payload data from controller
   */
  @Allow()
  @ApiHideProperty()
  public _data?: Record<string, any>;
}
