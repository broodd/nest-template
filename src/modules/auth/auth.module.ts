import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
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
      useFactory: (configService: ConfigService) =>
        Object.assign(
          {
            store: redisStore,
            prefix: CACHE_AUTH_PREFIX,
            ttl: configService.get<number>('CACHE_AUTH_TTL'),
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<string>('REDIS_PORT'),
          },
          configService.get<boolean>('REDIS_HAS_PASSWORD') && {
            auth_pass: configService.get<string>('REDIS_PASSWORD'),
          },
          configService.get<boolean>('REDIS_TLS') && {
            tls: {
              rejectUnauthorized: false,
            },
          },
        ) as CacheModuleOptions,
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
