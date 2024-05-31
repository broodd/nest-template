import { PayloadTooLargeException, UnsupportedMediaTypeException } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { FilesValidationPipe } from './files-validation.pipe';

describe('FilesValidationPipe', () => {
  const configService: ConfigService = new ConfigService();
  const allowedTypes = configService.get('STORE_MIME_TYPE');
  const pipe: FilesValidationPipe = new FilesValidationPipe(configService);

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return a multipart files', () => {
    const multipart = { mimetype: allowedTypes[0] } as MultipartFile;
    const data = { files: [multipart] };
    const received = pipe.transform(data);
    expect(received).toEqual(data);
  });

  it('should return a value when files not exists', () => {
    const received = pipe.transform(null);
    expect(received).toEqual(null);
  });

  it('should return an error with wrong mimetype', () => {
    const error = new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);
    try {
      pipe.transform({ files: [{ mimetype: 'broken' }] });
    } catch (e) {
      expect(e).toBeInstanceOf(UnsupportedMediaTypeException);
      expect(e).toEqual(error);
    }
  });

  it('should return an error with too large files', () => {
    const error = new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);
    try {
      pipe.transform({
        files: [{ limit: false }, { limit: true }],
      });
    } catch (e) {
      expect(e).toBeInstanceOf(PayloadTooLargeException);
      expect(e).toEqual(error);
    }
  });
});
