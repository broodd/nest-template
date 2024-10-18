import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { GroupEntity } from '../entities';

/**
 * [description]
 */
export class PaginationGroupsDto extends PaginationDto<GroupEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [GroupEntity] })
  public readonly result: GroupEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
