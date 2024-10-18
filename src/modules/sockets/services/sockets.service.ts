import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * [description]
 */
@Injectable()
export class SocketsService {
  /**
   * A map of active connections where **key** is a **userId**
   * and value is a map where **id** is **socketId** and value is **socket**
   * {
   *    'userId': {
   *        'socketId': Socket
   *    }
   * }
   */
  private readonly usersSockets: Map<string, Map<string, Socket>> = new Map<
    string,
    Map<string, Socket>
  >();

  /**
   * [description]
   * @param userId
   * @param socket
   */
  public addOne(userId: string, socket: Socket): void {
    if (!this.usersSockets.get(userId)) this.usersSockets.set(userId, new Map<string, Socket>());
    this.usersSockets.get(userId).set(socket.id, socket);
  }

  /**
   * [description]
   * @param userIds
   */
  public selectManyIds(userIds: string[]): string[] {
    return userIds.reduce<string[]>((acc, current) => acc.concat(this.selectOneIds(current)), []);
  }

  /**
   * [description]
   * @param userId
   */
  public selectOneIds(userId: string): string[] {
    return Array.from(this.usersSockets.get(userId)?.keys() ?? []);
  }

  /**
   * [description]
   * @param userId
   * @param socketId
   */
  public selectOne(userId: string, socketId: string): Socket | undefined {
    return this.usersSockets.get(userId)?.get(socketId);
  }

  /**
   * [description]
   * @param userId
   * @param socketId
   */
  public removeOne(userId: string, socketId: string): void {
    const sockets = this.usersSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (!sockets.size) this.usersSockets.delete(userId);
  }
}
