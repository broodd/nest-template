import { Observable } from 'rxjs';

import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

/**
 * Set query userId in GET methods
 */
@Injectable()
export class AddUserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') return next.handle();

    request.query ??= {};
    request.query._userId = request.user?.id;
    request.query._role = request.user?.role;
    // Be cautious with this: improper use can lead to security issues.
    // Always override this query field with request.user.id to ensure accuracy,
    // as users could manually pass values that may result in unauthorized data access.

    return next.handle();
  }
}
