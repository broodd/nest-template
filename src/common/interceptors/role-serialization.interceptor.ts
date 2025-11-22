import { ClassTransformOptions, instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from '@nestjs/common';

/**
 * Expose specific fields only for admin
 */
@Injectable()
export class RoleSerializationInterceptor implements NestInterceptor {
  /**
   * [description]
   * @param context
   * @param next
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const role = request.user?.role;

    const transformOptions: ClassTransformOptions = {
      groups: role ? [role] : [],
    };

    return next.handle().pipe(map((data) => instanceToPlain(data, transformOptions)));
  }
}
