import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { UserEntity, UserNotificationTokenEntity } from '../entities';
import {
  PaginationUsersDto,
  SelectUserNotificationTokensDto,
  SelectUserNotificationTokenDto,
  CreateUserNotificationTokenDto,
  UpdateUserNotificationTokenDto,
} from '../dto';

import { UserNotificationTokensController } from './user-notification-tokens.controller';
import { UserNotificationTokensService } from '../services';

describe('UserNotificationTokensController', () => {
  const optionsAll = new SelectUserNotificationTokensDto();
  const optionsOne = new SelectUserNotificationTokenDto();
  const createOne = new CreateUserNotificationTokenDto();
  const updateDto = new UpdateUserNotificationTokenDto();
  const owner = new UserEntity();

  let controller: UserNotificationTokensController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationTokensController],
      providers: [
        {
          provide: UserNotificationTokensService,
          useValue: {
            createOne: (data: Partial<UserNotificationTokenEntity>) =>
              plainToInstance(UserNotificationTokenEntity, { ...owner, ...data }),
            selectAll: () => new PaginationUsersDto([[owner], 1]),
            selectOne: () => new UserNotificationTokenEntity(),
            updateOne: (
              owner: UserNotificationTokenEntity,
              data: Partial<UserNotificationTokenEntity>,
            ) => plainToInstance(UserNotificationTokenEntity, { ...owner, ...data }),
            deleteOne: () => new UserNotificationTokenEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserNotificationTokensController>(UserNotificationTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return entity', async () => {
      const received = await controller.createOne(createOne, owner);
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
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
      const received = await controller.selectOne(owner, optionsOne, owner);
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
    });
  });

  describe('updateOne', () => {
    it('should be return entity', async () => {
      const received = await controller.updateOne(owner, updateDto, owner);
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return entity', async () => {
      const received = await controller.deleteOne(owner, owner);
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
    });
  });
});
