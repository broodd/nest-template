import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ApiOperation } from '@nestjs/swagger';
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
    if (descriptor) {
      // Applied at method level
      setRolesMetadata(target, key, descriptor, roles);
    } else {
      // Applied at class level
      const proto = target.prototype;
      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (name) => name !== 'constructor' && typeof proto[name] === 'function',
      );

      for (const methodName of methodNames) {
        const methodDescriptor = Object.getOwnPropertyDescriptor(proto, methodName);
        if (methodDescriptor) {
          setRolesMetadata(proto, methodName, methodDescriptor, roles);
        }
      }
    }
  };

/**
 * [description]
 * @param target
 * @param key
 * @param descriptor
 * @param roles
 */
function setRolesMetadata(
  target: Record<string, any>,
  key: string | symbol | undefined,
  descriptor: TypedPropertyDescriptor<any> | undefined,
  roles: UserRoleEnum[],
) {
  const operation: OperationObject = Reflect.getMetadata(
    DECORATORS.API_OPERATION,
    descriptor.value,
  );

  if (!operation) ApiOperation({ summary: `[ROLE: ${roles}]` })(target, key, descriptor);
  else operation.summary = `[ROLE: ${roles}]${operation.summary ? ': ' + operation.summary : ''}`;

  SetMetadata('roles', roles)(target, key, descriptor);
}
