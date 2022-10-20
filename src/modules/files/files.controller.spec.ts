import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from 'src/multipart';
import { createRepMock } from 'test/utils';

import { PaginationFilesDto, SelectFileDto, SelectFilesDto } from './dto';
import { ConfigService } from 'src/config';
import { FileEntity } from './entities';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UserEntity } from '../users/entities';

describe('FilesController', () => {
  let controller: FilesController;

  const optionsOne = new SelectFileDto();
  const optionsAll = new SelectFilesDto();
  const ownerOfFile = new UserEntity();

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
            updateOne: () => new FileEntity(),
            selectAll: () => new PaginationFilesDto([[new FileEntity()], 1]),
            selectOne: () => new FileEntity(),
            deleteOne: () => new FileEntity(),
            downloadOne: () => createRepMock(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.updateOne(createRepMock(), { id: '' }, ownerOfFile);
      expect(received).toBeInstanceOf(FileEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return files entity', async () => {
      const received = await controller.selectAll(optionsAll);
      expect(received).toBeInstanceOf(PaginationFilesDto);
    });
  });

  describe('selectOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.selectOne({ id: '' }, ownerOfFile, optionsOne);
      expect(received).toBeInstanceOf(FileEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return file entity', async () => {
      const received = await controller.deleteOne({ id: '' }, ownerOfFile);
      expect(received).toBeInstanceOf(FileEntity);
    });
  });
});
