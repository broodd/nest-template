import {
  UnsupportedMediaTypeException,
  PayloadTooLargeException,
  PipeTransform,
  Injectable,
} from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { MultipartBodyFile } from '../interfaces';

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
  transform(value: { file: MultipartBodyFile & { limit?: boolean } }) {
    const file = value?.file;

    if (file) {
      if (file.limit) throw new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);
      if (!this.allowedTypes.includes(file.mimetype))
        throw new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);
    }

    return value;
  }
}
