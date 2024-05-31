import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * [description]
 */
export class ID {
  /**
   * Entity ID
   */
  @IsUUID()
  @ApiProperty({ example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  public readonly id: string;
}
