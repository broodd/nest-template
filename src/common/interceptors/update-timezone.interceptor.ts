import 'fastify';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { UsersService } from 'src/modules/users/services';
import { ReqAuthUserDto } from 'src/modules/auth/dto';

/**
 * [description]
 */
declare module 'fastify' {
  interface FastifyRequest {
    user: ReqAuthUserDto;
  }
}

/**
 * [description]
 */
@Injectable()
export class UpdateTimezoneInterceptor implements NestInterceptor {
  /**
   * [description]
   */
  private usersService: UsersService;

  /**
   * [description]
   * @param moduleRef
   */
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * [description]
   * @param context
   * @param next
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    if (!this.usersService) {
      this.usersService = this.moduleRef.get(UsersService, { strict: false });
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user;
    const timezone = request.headers['x-timezone'] as string;

    if (user && timezone && user.timezone !== timezone) {
      await this.usersService.update({ id: user.id }, { timezone });
    }

    return next.handle();
  }
}
