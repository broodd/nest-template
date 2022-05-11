import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { SelectUsersDto } from '../dto';
import { UserNotificationTokenEntity } from '../entities';

import { UserNotificationTokensService } from './user-notification-tokens.service';

describe('UserNotificationTokensService', () => {
  const expected = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    token: 'some-token',
    owner: { id: '067f2f3e-b936-4029-93d6-b2f58ae4f489' },
  } as UserNotificationTokenEntity;

  let service: UserNotificationTokensService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([UserNotificationTokenEntity]),
        ConfigModule,
        DatabaseModule,
      ],
      providers: [UserNotificationTokensService],
    }).compile();

    service = module.get<UserNotificationTokensService>(UserNotificationTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return user entity', async () => {
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be return users pagination entity', async () => {
      const received = await service.selectAll();
      expect(received.length).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToInstance(SelectUsersDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKENS_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return user entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return user entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { token: 'some-token-2' });
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
      expect(received.token).not.toEqual(expected.token);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });

    it('should be return not found exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_ALREADY_EXIST);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => ({ id: '' } as UserNotificationTokenEntity));

      return service.updateOne({ id: '' }, { token: null }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return user entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(UserNotificationTokenEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOTIFICATION_TOKEN_NOT_FOUND);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => new UserNotificationTokenEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
