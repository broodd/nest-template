import { classToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../entities';
import {
  PaginationUsersDto,
  SelectUsersDto,
  SelectUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '../dto';

import { UsersController } from './users.controller';
import { UsersService } from '../services';

describe('UsersController', () => {
  const optionsAll = new SelectUsersDto();
  const optionsOne = new SelectUserDto();
  const createOne = new CreateUserDto();
  const updateDto = new UpdateUserDto();
  const owner = new UserEntity();

  let controller: UsersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createOne: (data: Partial<UserEntity>) => classToClassFromExist(data, owner),
            selectAll: () => new PaginationUsersDto([[owner], 1]),
            selectOne: () => new UserEntity(),
            updateOne: (owner: UserEntity, data: Partial<UserEntity>) =>
              classToClassFromExist(data, owner),
            deleteOne: () => new UserEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return entity', async () => {
      const received = await controller.createOne(createOne);
      expect(received).toBeInstanceOf(UserEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return entity', async () => {
      const received = await controller.selectAll(optionsAll);
      expect(received).toBeInstanceOf(PaginationUsersDto);
    });
  });

  describe('selectOne', () => {
    it('should be return entity', async () => {
      const received = await controller.selectOne(owner, optionsOne);
      expect(received).toBeInstanceOf(UserEntity);
    });
  });

  describe('updateOne', () => {
    it('should be return entity', async () => {
      const received = await controller.updateOne(owner, updateDto);
      expect(received).toBeInstanceOf(UserEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return entity', async () => {
      const received = await controller.deleteOne(owner);
      expect(received).toBeInstanceOf(UserEntity);
    });
  });
});
