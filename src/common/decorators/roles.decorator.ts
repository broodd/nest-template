import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { SetMetadata } from '@nestjs/common';

import { UserRoleEnum } from 'src/modules/users/enums';

/**
 * [description]
 * @param roles
 * @constructor
 */
export const UseRole =
  (...roles: UserRoleEnum[]) =>
  /**
   *
   * @param target      [description]
   * @param key         [description]
   * @param descriptor  [description]
   */
  (
    target: Record<string, any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    const operation: OperationObject = Reflect.getMetadata(
      DECORATORS.API_OPERATION,
      descriptor.value,
    );

    if (!operation) ApiOperation({ summary: `[ROLE: ${roles}]` })(target, key, descriptor);
    else operation.summary = `[ROLE: ${roles}]${operation.summary && ': ' + operation.summary}`;

    SetMetadata('roles', roles)(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
  };
