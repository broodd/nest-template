import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
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
  exports: [SocketsService],
})
export class SocketsModule {}
