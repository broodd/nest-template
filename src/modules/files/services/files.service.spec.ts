import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';

import { ErrorTypeEnum } from 'src/common/enums';
import { StorageService } from 'src/multipart';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { PaginationFilesDto, SelectFileDto, SelectFilesDto } from '../dto';
import { MultipartBodyFile } from 'src/multipart/interfaces';
import { FilesService } from './files.service';
import { FileEntity } from '../entities';

describe('FilesService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bfd',
    filename: 'test.jpg',
    key: 'test/test.jpg',
    mimetype: 'image/jpg',
    encoding: '7bit',
    extname: '.jpg',
    fileSize: '123',
    createdAt: new Date('2021-01-15T05:43:30.034Z'),
    updatedAt: new Date('2021-01-15T05:43:30.034Z'),
  } as FileEntity;

  let service: FilesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([FileEntity]), DatabaseModule, ConfigModule],
      providers: [
        FilesService,
        {
          provide: StorageService,
          useValue: {
            createOne: (rep: FastifyReply): FastifyReply => rep,
            selectOne: (rep: FastifyReply): FastifyReply => rep,
            deleteOne: () => undefined,
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return file entity', async () => {
      const received = await service.createOne(expected as unknown as MultipartBodyFile);
      expect(received).toBeInstanceOf(FileEntity);
      expect(received).toEqual(expected);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
      const data = { ...expected, id: '' } as unknown as MultipartBodyFile;
      return expect(service.createOne(data)).rejects.toThrow(error);
    });
  });

  describe('selectManyAndCount', () => {
    it('should be return files pagination entity', async () => {
      const received = await service.selectManyAndCount(new SelectFilesDto());
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).not.toEqual(0);
    });

    it('should be return files pagination entity by title filtering', async () => {
      const options = plainToClassFromExist(new SelectFilesDto(), { filename: '  ' });
      const received = await service.selectManyAndCount(options);
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).toEqual(0);
    });

    it('should be return not found exception', async () => {
      const options = plainToClassFromExist(new SelectFilesDto(), { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
      return expect(service.selectManyAndCount(options)).rejects.toThrow(error);
    });
  });

  describe('selectOne', () => {
    const options = plainToClassFromExist(new SelectFileDto(), {});

    it('should be return file entity', async () => {
      const received = await service.selectOne({ id: expected.id }, options);
      expect(received).toBeInstanceOf(FileEntity);
      expect(received).toEqual(expected);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
      return expect(service.selectOne({ id: '' }, options)).rejects.toThrow(error);
    });
  });

  describe('updateOne', () => {
    it('should be return file entity', async () => {
      const received = await service.updateOne(
        {
          id: expected.id,
        },
        expected as unknown as MultipartBodyFile,
      );
      expect(received).toBeInstanceOf(FileEntity);
      expect(received).toEqual(expected);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
      const data = { ...expected, id: '' } as unknown as MultipartBodyFile;
      return expect(service.updateOne({ id: expected.id }, data)).rejects.toThrow(error);
    });
  });

  describe('deleteOne', () => {
    it('should be return file entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(FileEntity);
      expect(received.id).toBe(undefined);
    });

    it('should be return not found exception by owner', async () => {
      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new FileEntity());

      const error = new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
      return expect(service.deleteOne({ id: expected.id })).rejects.toThrow(error);
    });

    it('should be return not found exception by id', async () => {
      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new FileEntity());

      const error = new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
      return expect(service.deleteOne({ id: '' })).rejects.toThrow(error);
    });
  });
});
