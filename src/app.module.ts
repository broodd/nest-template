import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from './config';
import { MultipartModule } from './multipart';
import { DatabaseModule } from './database';
import './database/polyfill';

import { UsersModule } from './modules/users';
import { FilesModule } from './modules/files';
import { AuthModule } from './modules/auth';

import { AppController } from './app.controller';

import { RelationshipsModule } from './modules/relationships';
import { NotificationsModule } from './modules/notifications';
import { SocketsModule } from './modules/sockets';
import { GroupsModule } from './modules/groups';
import { PostsModule } from './modules/posts';
import { ChatsModule } from './modules/chats';

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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            // tls: configService.get('REDIS_TLS'),
            // rejectUnauthorized: false
          },
        });
        return {
          store: { create: () => store },
        };
      },
      inject: [ConfigService],
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
    MultipartModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        region: config.get('AWS_S3_REGION'),
        bucket: config.get('AWS_S3_BUCKET'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    ConfigModule,
    AuthModule,
    SocketsModule,
    UsersModule,
    PostsModule,
    RelationshipsModule,
    GroupsModule,
    ChatsModule,
    NotificationsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
