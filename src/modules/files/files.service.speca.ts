import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Multipart } from 'fastify-multipart';
import { FastifyReply } from 'fastify';

import * as utils from 'test/utils';
import * as path from 'path';

import { ErrorTypeEnum } from 'src/common/enums';
import { StorageService } from 'src/multipart';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { PaginationFilesDto, SelectFilesDto, SelectFileDto, DownloadFileDto } from './dto';
import { FileEntity } from './entities';

import { FilesService } from './files.service';

describe('FilesService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bfd',
    title: 'test',
    filename: 'eb8898d6-3927-4b17-9fea-7805eb8f5a1c',
    fileSize: '150',
    mimetype: 'image/jpg',
    encoding: '7bit',
    extname: '.jpg',
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
      const received = await service.createOne(expected as unknown as Multipart);
      const url = new URL(expected.title, process.env.CDN);
      url.searchParams.set('id', expected.id);
      expect(received).toBeInstanceOf(FileEntity);
      expect(received.src).toEqual(url.toString());
      expect(received).toEqual(expected);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
      const data = { ...expected, id: '' } as unknown as Multipart;
      return expect(service.createOne(data)).rejects.toThrow(error);
    });
  });

  describe('selectAll', () => {
    it('should be return files pagination entity', async () => {
      const received = await service.selectAll();
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).not.toEqual(0);
    });

    it('should be return files pagination entity by title filtering', async () => {
      const options = plainToClassFromExist(new SelectFilesDto(), { title: '  ' });
      const received = await service.selectAll(options);
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).toEqual(0);
    });

    it('should be return not found exception', async () => {
      const options = plainToClassFromExist(new SelectFilesDto(), { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.FILES_NOT_FOUND);
      return expect(service.selectAll(options)).rejects.toThrow(error);
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
      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      return expect(service.selectOne({ id: '' }, options)).rejects.toThrow(error);
    });
  });

  describe('downloadOne', () => {
    const options = plainToClassFromExist(new DownloadFileDto(), {});
    const rep = utils.createRepMock(200, expected.mimetype);

    it('should be return file stream', async () => {
      const received = await service.downloadOne(rep, { id: expected.id }, options);
      expect(received).toEqual(rep);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      return expect(service.downloadOne(rep, { id: '' }, options)).rejects.toThrow(error);
    });
  });

  describe('updateOne', () => {
    it('should be return file entity', async () => {
      const received = await service.updateOne(expected as unknown as Multipart, {
        id: expected.id,
      });
      const url = new URL(process.env.CDN);
      url.pathname = path.join(url?.pathname, String(expected.title));
      url.searchParams.set('id', expected.id);
      expect(received).toBeInstanceOf(FileEntity);
      expect(received.src).toEqual(url.toString());
      expect(received).toEqual(expected);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
      const data = { ...expected, id: '' } as unknown as Multipart;
      return expect(service.updateOne(data, { id: expected.id })).rejects.toThrow(error);
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

      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      return expect(service.deleteOne({ id: expected.id })).rejects.toThrow(error);
    });

    it('should be return not found exception by id', async () => {
      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new FileEntity());

      const error = new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      return expect(service.deleteOne({ id: '' })).rejects.toThrow(error);
    });
  });
});
