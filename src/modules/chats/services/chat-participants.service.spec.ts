import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/modules/users/entities';
import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { SelectChatMessagesDto } from '../dto';
import { ChatMessageEntity, ChatEntity } from '../entities';

import { ChatMessagesService } from './chat-messages.service';
import { ChatsService } from './chats.service';

describe('ChatMessagesService', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;
  const chat = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd3',
    participants: [{ user }],
  } as ChatEntity;
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd2',
    chat: { id: chat.id },
    owner: { id: user.id },
  } as ChatMessageEntity;

  let service: ChatMessagesService;
  let chatsService: ChatsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([ChatMessageEntity, ChatEntity]),
        ConfigModule,
        DatabaseModule,
      ],
      providers: [ChatMessagesService, ChatsService],
    }).compile();

    service = module.get<ChatMessagesService>(ChatMessagesService);
    chatsService = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return entity', async () => {
      await chatsService.createOne(chat);
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(ChatMessageEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.CHAT_MESSAGE_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be returns pagination entity', async () => {
      const received = await service.selectAll(new SelectChatMessagesDto(), chat, user);
      expect(received.total).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToClass(SelectChatMessagesDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.CHAT_MESSAGES_NOT_FOUND);
      return service.selectAll(options, chat, user).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(ChatMessageEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { text: 'Chat message text' });
      expect(received).toBeInstanceOf(ChatMessageEntity);
      expect(received.text).not.toEqual(expected.text);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(ChatMessageEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CHAT_MESSAGE_NOT_FOUND);

      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new ChatMessageEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
