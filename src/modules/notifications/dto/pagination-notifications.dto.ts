import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { NotificationEntity } from '../entities';

/**
 * [description]
 */
export class PaginationNotificationsDto extends PaginationDto<NotificationEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [NotificationEntity] })
  public readonly result: NotificationEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
