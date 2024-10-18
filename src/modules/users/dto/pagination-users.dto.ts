import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { UserEntity, UserRefreshTokenEntity } from '../entities';

/**
 * [description]
 */
export class PaginationUsersDto extends PaginationDto<UserEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [UserEntity] })
  public readonly result: UserEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}

/**
 * [description]
 */
export class PaginationUsersRefreshTokensDto extends PaginationDto<UserRefreshTokenEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [UserRefreshTokenEntity] })
  public readonly result: UserRefreshTokenEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
