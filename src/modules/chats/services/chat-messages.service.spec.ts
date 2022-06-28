import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/modules/users/entities';
import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { ChatParticipantEntity, ChatEntity } from '../entities';

import { ChatParticipantsService } from './chat-participants.service';
import { ChatsService } from './chats.service';
import { FindManyOptionsDto } from 'src/common/dto';

describe('ChatParticipantsService', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;
  const chat = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd4',
  } as ChatEntity;
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd2',
    chat: { id: chat.id },
    user: { id: user.id },
  } as ChatParticipantEntity;

  let service: ChatParticipantsService;
  let chatsService: ChatsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([ChatParticipantEntity, ChatEntity]),
        ConfigModule,
        DatabaseModule,
      ],
      providers: [ChatParticipantsService, ChatsService],
    }).compile();

    service = module.get<ChatParticipantsService>(ChatParticipantsService);
    chatsService = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return entity', async () => {
      await chatsService.createOne(chat);
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(ChatParticipantEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.CHAT_PARTICIPANT_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be returns pagination entity', async () => {
      const received = await service.selectAll();
      expect(received.total).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToClass(FindManyOptionsDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANTS_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(ChatParticipantEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANT_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { user: { id: user.id } });
      expect(received).toBeInstanceOf(ChatParticipantEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANT_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(ChatParticipantEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_PARTICIPANT_NOT_FOUND);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => new ChatParticipantEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
