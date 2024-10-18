import { UseFilters, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';

import { SocketsExceptionFilter } from 'src/common/filters';
import { validationPipe } from 'src/common/pipes';
import { ErrorTypeEnum } from 'src/common/enums';

import { UsersService } from 'src/modules/users/services';
import { UserEntity } from 'src/modules/users/entities';
import { SocketsService } from './sockets.service';

/**
 * [description]
 */
@WebSocketGateway({
  cors: { origin: '*' }, // TODO, TBD
  transports: ['websocket'],
})
@UsePipes(validationPipe)
@UseFilters(SocketsExceptionFilter)
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  /**
   * [description]
   * @param jwtService
   * @param usersService
   * @param socketsService
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly socketsService: SocketsService,
  ) {}

  /**
   * [description]
   * @param socket
   */
  public async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      const { token } = socket.handshake.auth;
      const { id } = this.jwtService.verify<UserEntity>(token);

      await this.usersService.selectOne({ id }, { select: ['id'], loadEagerRelations: false });

      socket.data = { user: { id } };
      this.socketsService.addOne(id, socket);
    } catch (error) {
      socket.emit(ErrorTypeEnum.SOCKET_ERROR, { message: error.message });
      socket.disconnect();
    }
  }

  /**
   * [description]
   * @param socket
   */
  public async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const { token } = socket.handshake.auth;
    const { id } = this.jwtService.verify<UserEntity>(token);

    this.socketsService.removeOne(id, socket.id);
  }
}
