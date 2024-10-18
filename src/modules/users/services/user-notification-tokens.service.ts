import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/services';

import { PaginationUserNotificationTokensDto } from '../dto/user-notification-tokens';
import { UserNotificationTokenEntity } from '../entities';

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
   */
  private readonly maxCountOfNotificationTokens = 10;

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

  /**
   * [description]
   * @param conditions
   */
  public async deleteOldNotificationTokens(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
  ): Promise<void> {
    const tokens = await this.repository.find({
      select: { id: true, createdAt: true },
      where: conditions,
      skip: this.maxCountOfNotificationTokens,
      order: { createdAt: 'DESC' },
    });
    if (tokens.length) await this.repository.delete(tokens.map((token) => token.id));
  }
}
