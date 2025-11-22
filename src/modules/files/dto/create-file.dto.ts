import { IsNotEmpty, IsObject } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { TransformValidateFile } from 'src/common/helpers';

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
  @TransformValidateFile()
  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'multipart file field',
  })
  public readonly file: MultipartBodyFile;
}
