import { ArgumentsHost, Catch, HttpException, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { ErrorTypeEnum } from '../enums';

/**
 * [description]
 */
@Catch()
export class SocketsExceptionFilter implements WsExceptionFilter {
  /**
   * [description]
   */
  catch(exception: WsException | HttpException | Error, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  /**
   * [description]
   */
  public handleError(client: Socket, exception: WsException | HttpException | Error): void {
    if (exception instanceof WsException) {
      client.emit(ErrorTypeEnum.SOCKET_ERROR, { message: exception.getError() });
    } else if (exception instanceof HttpException) {
      const { message, error } = exception.getResponse() as Record<string, string>;
      client.emit(ErrorTypeEnum.SOCKET_ERROR, { message, error });
    } else {
      client.emit(ErrorTypeEnum.SOCKET_ERROR, { message: exception.message || exception });
    }
  }
}
