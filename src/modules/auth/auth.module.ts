import { redisStore } from 'cache-manager-redis-yet';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SendMailModule } from 'src/sendmail';
import { UsersModule } from '../users';

import { JwtRefreshTokenStrategy, JwtStrategy } from './strategies';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from 'src/config';
import { CACHE_AUTH_PREFIX } from './auth.constants';

/**
 * [description]
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    SendMailModule,
    UsersModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          keyPrefix: CACHE_AUTH_PREFIX,
        });

        return { store: { create: () => store } };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
