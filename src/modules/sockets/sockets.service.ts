import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * [description]
 */
@Injectable()
export class SocketsService {
  /**
   * [description]
   * {
   *    'user-id': {
   *        'socket-id': Socket
   *    }
   * }
   */
  private usersSockets: Record<string, Record<string, Socket>> = {};

  /**
   * [description]
   * @param userId
   * @param socket
   */
  public addOne(userId: string, socket: Socket): void {
    const store = (this.usersSockets[userId] = this.usersSockets[userId] || {});
    store[socket.id] = socket;
  }

  /**
   * [description]
   * @param userId
   */
  public selectAllIds(userIds: string[]): string[] {
    return userIds.reduce<string[]>((acc, current) => acc.concat(this.selectOneIds(current)), []);
  }

  /**
   * [description]
   * @param userId
   */
  public selectOneIds(userId: string): string[] {
    if (!this.usersSockets[userId]) return [];
    return Object.keys(this.usersSockets[userId]);
  }

  /**
   * [description]
   * @param userId
   * @param socketId
   */
  public selectOne(userId: string, socketId: string): Socket {
    if (!this.usersSockets[userId]) return null;
    return this.usersSockets[userId][socketId];
  }

  /**
   * [description]
   * @param userId
   * @param socketId
   */
  public removeOne(userId: string, socketId: string): void {
    if (!this.usersSockets[userId]) return;
    delete this.usersSockets[userId][socketId];

    if (!Object.keys(this.usersSockets[userId]).length) delete this.usersSockets[userId];
  }
}
