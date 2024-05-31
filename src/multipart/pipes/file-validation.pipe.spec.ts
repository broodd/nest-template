import { PayloadTooLargeException, UnsupportedMediaTypeException } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { FileValidationPipe } from './file-validation.pipe';
import { MultipartBodyFile } from '../interfaces';

describe('FileValidationPipe', () => {
  const configService: ConfigService = new ConfigService();
  const allowedTypes = configService.get('STORE_MIME_TYPE');
  const pipe: FileValidationPipe = new FileValidationPipe(configService);

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return a multipart file', () => {
    const multipart = { file: { mimetype: allowedTypes[0] } as MultipartBodyFile };
    const received = pipe.transform(multipart);
    expect(received).toEqual(multipart);
  });

  it('should return a value when file not exists', () => {
    const received = pipe.transform(null);
    expect(received).toEqual(null);
  });

  it('should return an error with wrong mimetype', () => {
    const error = new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);
    try {
      pipe.transform({ file: { mimetype: 'broken' } as MultipartBodyFile });
    } catch (e) {
      expect(e).toBeInstanceOf(UnsupportedMediaTypeException);
      expect(e).toEqual(error);
    }
  });

  it('should return an error with too large file', () => {
    const error = new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);
    try {
      pipe.transform({ file: { limit: true } as unknown as MultipartBodyFile });
    } catch (e) {
      expect(e).toBeInstanceOf(PayloadTooLargeException);
      expect(e).toEqual(error);
    }
  });
});
