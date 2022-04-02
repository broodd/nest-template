import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
  UnauthorizedException,
  ForbiddenException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from 'src/modules/users/entities';
import { UserRoleEnum } from 'src/modules/users/enums';

/**
 * [description]
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * [description]
   * @param reflector
   */
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * [description]
   * @param err
   * @param user
   * @param info
   * @param ctx
   */
  public handleRequest(
    _err: Error,
    user: UserEntity,
    info: Error,
    ctx: ExecutionContext,
  ): UserEntity | any {
    if (info) throw new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_TOKEN);
    if (!user) throw new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);

    const roles = this.reflector.get<UserRoleEnum[]>('roles', ctx.getHandler());
    if (roles && !roles.includes(user.role))
      throw new ForbiddenException(ErrorTypeEnum.AUTH_FORBIDDEN);
    return user;
  }
}
