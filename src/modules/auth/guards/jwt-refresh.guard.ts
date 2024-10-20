import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  /**
   * [description]
   */
  constructor() {
    super();
  }

  /**
   * [description]
   * @param _err
   * @param user
   * @param info
   * @param ctx
   */
  public handleRequest(_err: Error, user: UserEntity, info: Error): UserEntity | any {
    if (info) throw new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_REFRESH_TOKEN);
    if (!user) throw new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);
    return user;
  }
}
