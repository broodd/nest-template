import { MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class CreateUserNotificationTokenDto {
  /**
   * [description]
   */
  @MaxLength(1024)
  @ApiProperty({ maxLength: 1024 })
  public readonly token: string;
}
