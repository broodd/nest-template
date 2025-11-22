/* eslint no-use-before-define: 0 */

import { join } from 'node:path';

import { redisStore } from 'cache-manager-redis-yet';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { NotificationsModule } from './modules/notifications';
import { RelationshipsModule } from './modules/relationships';
import { ConfigService, ConfigModule } from './config';
import './database/polyfill';
import { SocketsModule } from './modules/sockets';
import { AppController } from './app.controller';
import { GroupsModule } from './modules/groups';
import { ChatsModule } from './modules/chats';
import { FilesModule } from './modules/files';
import { PostsModule } from './modules/posts';
import { UsersModule } from './modules/users';
import { MultipartModule } from './multipart';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth';
import { LogsModule } from './modules/logs';
import { StripeModule } from './stripe';

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
      imports: [FilesModule],
      useFactory: (config: ConfigService) => ({
        region: config.get('AWS_S3_REGION'),
        bucket: config.get('AWS_S3_BUCKET'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      serveRoot: '/public',
    }),
    DatabaseModule,
    ConfigModule,

    SocketsModule,
    FilesModule,
    UsersModule,
    AuthModule,

    PostsModule,
    RelationshipsModule,
    GroupsModule,
    ChatsModule,
    NotificationsModule,

    StripeModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('STRIPE_API_KEY'),
        products: config.get('STRIPE_PRODUCTS'),
        webhookSecret: config.get('STRIPE_WEBHOOK_SECRET'),
      }),
      inject: [ConfigService],
      imports: [LogsModule],
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
