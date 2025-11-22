import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ApiOperation } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';

export const LIMIT_ATTEMPTS_KEY = 'limitAttempts';

export interface LimitAttemptsOptions {
  name?: string;
  maxAttempts: number;
  ttlSeconds: number;
  identifier?: (req) => string | number;
}

const identifierCallback = (req) => req.user.id;
/**
 * [description]
 * @param options
 * @constructor
 */
export const LimitAttempts =
  (name?, maxAttempts = 10, ttlSeconds = 60, identifier = identifierCallback) =>
  (
    target: Record<string, any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    const options = { name, maxAttempts, ttlSeconds, identifier };

    if (descriptor) {
      // Applied at method level
      setLimitAttemptsMetadata(target, key, descriptor, options);
    } else {
      // Applied at class level
      const proto = target.prototype;
      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (name) => name !== 'constructor' && typeof proto[name] === 'function',
      );

      for (const methodName of methodNames) {
        const methodDescriptor = Object.getOwnPropertyDescriptor(proto, methodName);
        if (methodDescriptor) {
          setLimitAttemptsMetadata(proto, methodName, methodDescriptor, options);
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
function setLimitAttemptsMetadata(
  target: Record<string, any>,
  key: string | symbol | undefined,
  descriptor: TypedPropertyDescriptor<any> | undefined,
  options: LimitAttemptsOptions,
) {
  SetMetadata(LIMIT_ATTEMPTS_KEY, options)(target, key, descriptor);

  const operation: OperationObject = Reflect.getMetadata(
    DECORATORS.API_OPERATION,
    descriptor.value,
  );

  const message = `⚠️ Max ${options.maxAttempts} attempts per ${options.ttlSeconds} seconds`;
  if (!operation) {
    ApiOperation({ description: message })(target, key, descriptor);
  } else {
    const oldDescription = operation.description ? '<br/>' + operation.description : '';
    operation.description = `${message}${oldDescription}`;
  }
}
