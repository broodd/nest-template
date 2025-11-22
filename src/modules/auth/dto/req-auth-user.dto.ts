import { PickType } from '@nestjs/swagger';

import { UserEntity } from '../../users/entities';

export class ReqAuthUserDto extends PickType(UserEntity, [
  'id',
  'email',
  'password',
  'role',
  'refreshTokens',
  'timezone',
]) {}
