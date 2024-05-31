import {
  UnsupportedMediaTypeException,
  PayloadTooLargeException,
  PipeTransform,
  Injectable,
} from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

/**
 * [description]
 */
@Injectable()
export class FilesValidationPipe implements PipeTransform {
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
  transform(value: { files: any }) {
    if (!value?.files) return value;

    const isTooLarge = value.files.some((file) => file.limit);
    if (isTooLarge) throw new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);

    const isInvalidType = value.files.some((file) => !this.allowedTypes.includes(file.mimetype));
    if (isInvalidType) throw new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);

    return value;
  }
}
