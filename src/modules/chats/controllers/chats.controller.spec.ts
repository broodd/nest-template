import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '../../users/entities';

import { ChatMessagesService, ChatParticipantsService, ChatsService } from '../services';
import { ChatEntity, ChatMessageEntity, ChatParticipantEntity } from '../entities';
import { CreateChatDto, SelectChatsDto } from '../dto';
import { ChatsController } from './chats.controller';

describe('ChatsController', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;

  const optionsAll = new SelectChatsDto();
  const createOne = plainToInstance(CreateChatDto, { participant: new UserEntity() });

  const chat = new ChatEntity();
  const chatMessage = new ChatMessageEntity();

  let controller: ChatsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        {
          provide: ChatsService,
          useValue: {
            createOne: (data: Partial<ChatEntity>) =>
              plainToInstance(ChatEntity, { ...data, ...chat }),
            selectAll: () => [[chat], 1],
            selectOne: () => new ChatEntity(),
            selectOneByParticipants: () => new ChatEntity(),
            updateOne: (chat: ChatEntity, data: Partial<ChatEntity>) =>
              plainToInstance(ChatEntity, { ...chat, ...data }),
            deleteOne: () => new ChatEntity(),
          },
        },
        {
          provide: ChatMessagesService,
          useValue: {
            createOne: (data: Partial<ChatMessageEntity>) =>
              plainToInstance(ChatMessageEntity, { ...data, ...chatMessage }),
            selectAll: () => [[chatMessage], 1],
            selectOne: () => new ChatMessageEntity(),
            updateOne: (chatMessage: ChatMessageEntity, data: Partial<ChatMessageEntity>) =>
              plainToInstance(ChatMessageEntity, { ...chatMessage, ...data }),
            deleteOne: () => new ChatMessageEntity(),
          },
        },
        {
          provide: ChatParticipantsService,
          useValue: {
            selectOne: () => new ChatParticipantEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatsController>(ChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return entity', async () => {
      const received = await controller.createOne(createOne, user);
      expect(received).toBeInstanceOf(ChatEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return entity', async () => {
      const received = await controller.selectAll(optionsAll, user);
      expect(received.length).toEqual(expect.any(Number));
    });
  });

  describe('deleteOne', () => {
    it('should be return entity', async () => {
      const received = await controller.deleteOne(chat);
      expect(received).toBeInstanceOf(ChatEntity);
    });
  });
});
