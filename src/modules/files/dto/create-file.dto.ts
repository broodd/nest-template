import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UploadedFile } from 'src/multipart';

/**
 * [description]
 */
export class CreateFileDto {
  /**
   * Fastify multipart instance
   */
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'multipart file field',
  })
  public readonly file: UploadedFile;
}
