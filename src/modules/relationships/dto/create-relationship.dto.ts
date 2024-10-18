import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class CreateRelationshipDto {
  /**
   * [description]
   */
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public readonly isBlocked?: boolean;
}
