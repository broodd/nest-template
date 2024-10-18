import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';

import { SocketsService } from './sockets.service';

describe('SocketsService', () => {
  let service: SocketsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketsService],
    }).compile();

    service = module.get<SocketsService>(SocketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addOne', () => {
    it('add', async () => {
      service.addOne('1', { id: '1' } as Socket);
    });

    it('add another socket', async () => {
      service.addOne('1', { id: '2' } as Socket);
    });

    it('add to new user', async () => {
      service.addOne('2', { id: '1' } as Socket);
    });
  });

  describe('selectManyIds', () => {
    it('select', async () => {
      const received = service.selectManyIds(['1', '2']);
      expect(received).toEqual(['1', '2', '1']);
    });
  });

  describe('selectOneIds', () => {
    it('select', async () => {
      const received = service.selectOneIds('1');
      expect(received).toEqual(['1', '2']);
    });
  });

  describe('selectOne', () => {
    it('select', async () => {
      const received = service.selectOne('1', '1');
      expect(received).toEqual({ id: '1' });
    });
  });

  describe('removeOne', () => {
    it('select', async () => {
      service.removeOne('1', '1');
      const received = service.selectOne('1', '1');
      expect(received).toBeUndefined();
    });
  });
});
