import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto';

import { RelationshipEntity } from '../entities';

/**
 * [description]
 */
export class PaginationRelationshipsDto extends PaginationDto<RelationshipEntity> {
  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [RelationshipEntity] })
  public readonly result: RelationshipEntity[];

  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;
}
