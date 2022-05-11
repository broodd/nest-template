import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { dirname } from 'path';

import { ConfigService } from 'src/config';
import { TlsOptions } from 'node:tls';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const ssl: TlsOptions = configService.get<boolean>('TYPEORM_SSL') && {
          rejectUnauthorized: false,
        };

        return {
          name: configService.get<string>('TYPEORM_NAME'),
          type: configService.get<'postgres'>('TYPEORM_TYPE'),
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          username: configService.get(<string>'TYPEORM_USERNAME'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          cache: configService.get('TYPEORM_CACHE'),
          logging: configService.get('TYPEORM_LOGGING'),
          dropSchema: configService.get<boolean>('TYPEORM_DROP_SCHEMA'),
          synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
          migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN'),
          entities: [dirname(__dirname) + '/modules/**/*.entity.{ts,js}'],
          migrations: [__dirname + '/migrations/*.{ts,js}'],
          ssl,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
