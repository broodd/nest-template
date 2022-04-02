import { Test, TestingModule } from '@nestjs/testing';
import { Multipart } from 'fastify-multipart';
import {
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { createMockFile, createMockFileMeta } from 'test/utils';
import * as stream from 'stream';

import { ConfigModule, ConfigService } from 'src/config';
import { rm, stat } from 'fs/promises';

import { ErrorTypeEnum } from 'src/common/enums';

import { MultipartModule } from './multipart.module';
import { StorageService } from './storage.service';
import { UploadedFile } from './dto';

describe('StorageService', () => {
  const configService = new ConfigService();
  let service: StorageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MultipartModule.registerAsync({
          useFactory: (config: ConfigService) => ({
            limits: {
              fileSize: config.get('STORE_FILE_SIZE'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterAll(async () => {
    const destination = configService.getDest('STORE_DEST');
    await rm(destination, { recursive: true });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create service instance', () => {
    it('should be create dest folder', async () => {
      const destination = configService.getDest('STORE_DEST');
      await rm(destination, { recursive: true });
      expect(await stat(destination)).toEqual(false);
      expect(new StorageService(configService)).toBeDefined();
      expect(await stat(destination)).toEqual(true);
    });
  });

  describe('create service instance', () => {
    it('should be create dest folder', async () => {
      const destination = configService.getDest('STORE_DEST');
      expect(await stat(destination)).toEqual(true);
      expect(new StorageService(configService)).toBeDefined();
      expect(await stat(destination)).toEqual(true);
    });
  });

  describe('createOne', () => {
    it('should be create file', async () => {
      const data = createMockFileMeta();
      const response = await service.createOne(data as unknown as Multipart);
      expect(response).toBeInstanceOf(UploadedFile);
    });

    it('should be return unexpected file', async () => {
      const { filename, encoding, mimetype } = createMockFileMeta();
      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      const file = new stream.Readable();
      const data = { file, filename, encoding, mimetype };
      file.destroy(new Error());
      try {
        await service.createOne(data as unknown as Multipart);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      }
    });

    it('should be return payload too large exception', async () => {
      const { file, filename, encoding, mimetype } = createMockFileMeta();
      file['truncated'] = true;
      const data = { file, filename, encoding, mimetype };
      const error = new PayloadTooLargeException();
      try {
        await service.createOne(data as unknown as Multipart);
      } catch (err) {
        expect(err).toBeInstanceOf(PayloadTooLargeException);
        expect(err).toEqual(error);
      }
    });

    it('should be return unsupported media type exception', async () => {
      const { file, filename, encoding } = createMockFileMeta();
      const data = { file, filename, encoding, mimetype: 'broken' };
      const error = new UnsupportedMediaTypeException();
      try {
        await service.createOne(data as unknown as Multipart);
      } catch (err) {
        expect(err).toBeInstanceOf(UnsupportedMediaTypeException);
        expect(err).toEqual(error);
      }
    });
  });

  describe('selectOne', () => {
    it('should be return file', async () => {
      const { filename, mimetype } = createMockFile();
      await service.selectOne({ filename, mimetype });
    });

    it('should be return resize by width file', async () => {
      const { filename, mimetype } = createMockFile();
      await service.selectOne({ filename, mimetype }, { width: 1 });
    });

    it('should be return resize by height file', async () => {
      const { filename, mimetype } = createMockFile();
      await service.selectOne({ filename, mimetype }, { height: 1 });
    });

    it('should be return not found exception', () => {
      const filename = 'broken';
      const mimetype = 'broken';
      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      try {
        service.selectOne({ filename, mimetype });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      }
    });
  });

  describe('deleteOne', () => {
    it('should be delete file', async () => {
      const { filePath, filename } = createMockFile();
      await service.deleteOne(filename);
      expect(await stat(filePath)).toEqual(false);
    });

    it('should be return not found exception', async () => {
      const filename = 'broken';
      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      try {
        await service.deleteOne(filename);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      }
    });
  });
});
