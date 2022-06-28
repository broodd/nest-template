import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
export const SocketUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    return ctx.switchToWs().getClient().data.user;
  },
);
