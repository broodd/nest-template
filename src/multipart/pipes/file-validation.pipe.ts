import { Injectable, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';
import { Multipart } from 'fastify-multipart';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

/**
 * [description]
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  /**
   * [description]
   */
  private readonly allowedTypes: string[];

  /**
   * [description]
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {
    this.allowedTypes = this.configService.get('STORE_MIME_TYPE');
  }

  /**
   * [description]
   * @param value
   */
  transform(value: Multipart) {
    if (!this.allowedTypes.includes(value.mimetype))
      throw new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);
    return value;
  }
}
