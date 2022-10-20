import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultipartFile } from '@fastify/multipart';

import { ErrorTypeEnum } from 'src/common/enums';
import { StorageService } from 'src/multipart';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { UserRoleEnum } from '../users/enums';
import { UserEntity } from '../users/entities';

import { PaginationFilesDto, SelectFilesDto, SelectFileDto } from './dto';
import { FilesService } from './files.service';
import { FileEntity } from './entities';

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
  const owner = {
    role: UserRoleEnum.ADMIN,
  } as UserEntity;

  let service: FilesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([FileEntity]), DatabaseModule, ConfigModule],
      providers: [
        FilesService,
        {
          provide: StorageService,
          useValue: {
            createOne: (multipart: MultipartFile): MultipartFile => multipart,
            selectOne: (multipart: MultipartFile): MultipartFile => multipart,
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
      const received = await service.createOne(expected as unknown as MultipartFile, owner);
      const url = `${process.env.CDN}/${expected.filename}${expected.extname}`;
      expect(received).toBeInstanceOf(FileEntity);
      expect(received.src).toEqual(url.toString());
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
      const data = { ...expected, id: '' } as unknown as MultipartFile;
      return expect(service.createOne(data, owner)).rejects.toThrow(error);
    });
  });

  describe('selectAll', () => {
    it('should be return files pagination entity', async () => {
      const received = await service.selectAll();
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).not.toEqual(0);
    });

    it('should be return files pagination entity by title filtering', async () => {
      const options = plainToInstance(SelectFilesDto, { title: '  ' });
      const received = await service.selectAll(options);
      expect(received).toBeInstanceOf(PaginationFilesDto);
      expect(received.total).toEqual(0);
    });

    it('should be return not found exception', async () => {
      const options = plainToInstance(SelectFilesDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.FILES_NOT_FOUND);
      return expect(service.selectAll(options)).rejects.toThrow(error);
    });
  });

  describe('selectOne', () => {
    const options = plainToInstance(SelectFileDto, {});

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
