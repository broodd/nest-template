import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionCourseBookDto {
  @IsUUID()
  @ApiProperty()
  public readonly bookOrderId: string;
}
