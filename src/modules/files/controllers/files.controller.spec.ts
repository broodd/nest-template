import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from 'src/multipart';

import { ConfigService } from 'src/config';

import { CreateFileDto, PaginationFilesDto, SelectFileDto, SelectFilesDto } from '../dto';
import { FilesController } from './files.controller';
import { FilesService } from '../services';
import { FileEntity } from '../entities';

describe('FilesController', () => {
  let controller: FilesController;

  const createOne = new CreateFileDto();
  const selectOne = new SelectFileDto();
  const selectManyAndCount = new SelectFilesDto();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        ConfigService,
        {
          provide: StorageService,
          useValue: {},
        },
        {
          provide: FilesService,
          useValue: {
            createOne: () => new FileEntity(),
            selectManyAndCount: () => new PaginationFilesDto([[new FileEntity()], 1]),
            selectOne: () => new FileEntity(),
            deleteOne: () => new FileEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.createOne(createOne);
      expect(received).toBeInstanceOf(FileEntity);
    });
  });

  describe('selectManyAndCount', () => {
    it('should be return files entity', async () => {
      const received = await controller.selectManyAndCount(selectManyAndCount);
      expect(received).toBeInstanceOf(PaginationFilesDto);
    });
  });

  describe('selectOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.selectOne({ id: '' }, selectOne);
      expect(received).toBeInstanceOf(FileEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.deleteOne({ id: '' });
      expect(received).toBeInstanceOf(FileEntity);
    });
  });
});
