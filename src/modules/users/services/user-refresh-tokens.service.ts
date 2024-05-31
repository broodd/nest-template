import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { hash } from 'src/common/helpers';
import { randomBytes } from 'crypto';

import { PaginationUsersRefreshTokensDto } from '../dto';
import { UserRefreshTokenEntity } from '../entities';
import { CommonService } from 'src/common/services';

/**
 * [description]
 */
@Injectable()
export class UserRefreshTokensService extends CommonService<
  UserRefreshTokenEntity,
  PaginationUsersRefreshTokensDto
> {
  /**
   * [description]
   */
  private readonly maxCountOfRefreshTokens = 10;

  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(UserRefreshTokenEntity)
    public readonly repository: Repository<UserRefreshTokenEntity>,
  ) {
    super(UserRefreshTokenEntity, repository, PaginationUsersRefreshTokensDto);
  }

  /**
   * [description]
   * @param entityLike
   */
  public async generateAndCreateOne(
    entityLike: Partial<UserRefreshTokenEntity>,
  ): Promise<UserRefreshTokenEntity> {
    const refreshIdentifier = randomBytes(16).toString('hex');
    const refreshHash = await hash(refreshIdentifier);
    const entity = await this.createOne({ ...entityLike, ppid: refreshHash });
    entity.ppid = refreshIdentifier;
    return entity;
  }

  /**
   * [description]
   * @param conditions
   */
  public async deleteOldRefreshTokens(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
  ): Promise<void> {
    const tokens = await this.repository.find({
      select: { id: true, createdAt: true },
      where: conditions,
      skip: this.maxCountOfRefreshTokens,
      order: { createdAt: 'DESC' },
    });
    if (tokens.length) await this.repository.delete(tokens.map((token) => token.id));
  }
}
