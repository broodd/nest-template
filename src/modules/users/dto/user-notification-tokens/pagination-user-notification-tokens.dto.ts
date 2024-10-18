import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { UserNotificationTokenEntity } from '../../entities';

/**
 * [description]
 */
export class PaginationUserNotificationTokensDto extends PaginationDto<UserNotificationTokenEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [UserNotificationTokenEntity] })
  public readonly result: UserNotificationTokenEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
