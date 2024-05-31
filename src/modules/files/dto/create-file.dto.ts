import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { MultipartBodyFile } from 'src/multipart/interfaces';

/**
 * [description]
 */
export class CreateFileDto {
  /**
   * Fastify multipart instance
   */
  @IsObject()
  @IsNotEmpty()
  @Transform(({ value: [file] }) => file)
  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'multipart file field',
  })
  public readonly file: MultipartBodyFile;
}
