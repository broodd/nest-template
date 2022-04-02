import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from './config';
import { MultipartModule } from './multipart';
import { DatabaseModule } from './database';

import { UsersModule } from './modules/users';
import { FilesModule } from './modules/files';
import { AuthModule } from './modules/auth';

import { AppController } from './app.controller';

/**
 * [description]
 */
@Module({
  imports: [
    TerminusModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLE_TTL'),
        limit: configService.get('THROTTLE_LIMIT'),
      }),
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_HAS_PASSWORD')
            ? configService.get('REDIS_PASSWORD')
            : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    MultipartModule.register(),
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UsersModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
