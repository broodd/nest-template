import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';
import { UserEntity } from '../../users/entities';
import { UsersService } from '../../users/services';

describe('SocketsGateway', () => {
  let service: SocketsGateway;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketsGateway,
        {
          provide: JwtService,
          useValue: {
            verify: () => plainToInstance(UserEntity, { id: 'id', ppid: 'ppid' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            selectOne: () => plainToInstance(UserEntity, { id: 'id', ppid: 'ppid' }),
          },
        },
        {
          provide: SocketsService,
          useValue: { addOne: () => ({}), removeOne: () => void {} },
        },
      ],
    }).compile();

    service = module.get<SocketsGateway>(SocketsGateway);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should be handle connection', () => {
      service.handleConnection({ handshake: { auth: {} } } as Socket);
    });

    it('should be return error', () => {
      const mockDisconnect = jest.fn().mockReturnValue(undefined);
      const mockEmit = jest.fn().mockReturnValue(undefined);

      jest.spyOn(usersService, 'selectOne').mockRejectedValueOnce(new Error());

      service.handleConnection({
        emit: mockEmit,
        disconnect: mockDisconnect,
        handshake: { auth: {} },
      } as unknown as Socket);
    });
  });

  describe('handleConnection', () => {
    it('should be handle connection', () => {
      service.handleDisconnect({ handshake: { auth: {} } } as Socket);
    });

    it('should be return error', () => {
      const mockDisconnect = jest.fn().mockReturnValue(undefined);
      const mockEmit = jest.fn().mockReturnValue(undefined);

      jest.spyOn(usersService, 'selectOne').mockRejectedValueOnce(new Error());

      service.handleConnection({
        emit: mockEmit,
        disconnect: mockDisconnect,
        handshake: { auth: {} },
      } as unknown as Socket);
    });
  });
});
