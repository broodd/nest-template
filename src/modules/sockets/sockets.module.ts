import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { SocketsGateway } from './services/sockets.gateway';
import { SocketsService } from './services/sockets.service';
import { UsersModule } from '../users';

/**
 * [description]
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<number>('JWT_EXPIRES_ACCESS_TOKEN');
        return {
          secret: configService.get('JWT_SECRET_ACCESS_TOKEN'),
          signOptions: Object.assign({}, expiresIn && { expiresIn }),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [SocketsGateway, SocketsService],
  exports: [SocketsGateway, SocketsService],
})
export class SocketsModule {}
