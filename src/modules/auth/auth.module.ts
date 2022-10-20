import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { UsersModule } from '../users';

import { JwtRefreshTokenStrategy, JwtStrategy } from './strategies';

import { CACHE_AUTH_PREFIX } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendMailModule } from 'src/sendmail';

/**
 * [description]
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any,
        prefix: CACHE_AUTH_PREFIX,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('CACHE_AUTH_TTL'),
        // auth_pass: configService.get<string>('REDIS_PASSWORD')
        // tls: {
        //   rejectUnauthorized: false,
        // }
      }),
      inject: [ConfigService],
    }),
    SendMailModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
