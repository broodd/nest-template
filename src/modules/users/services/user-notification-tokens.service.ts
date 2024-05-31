import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PaginationUserNotificationTokensDto } from '../dto/user-notification-tokens';
import { UserNotificationTokenEntity } from '../entities';
import { CommonService } from 'src/common/services';

/**
 * [description]
 */
@Injectable()
export class UserNotificationTokensService extends CommonService<
  UserNotificationTokenEntity,
  PaginationUserNotificationTokensDto
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(UserNotificationTokenEntity)
    public readonly repository: Repository<UserNotificationTokenEntity>,
  ) {
    super(UserNotificationTokenEntity, repository, PaginationUserNotificationTokensDto);
  }
}
