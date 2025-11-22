import { dirname } from 'node:path';

import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ConfigService, ConfigMode } from 'src/config';

import { DatabaseLogger } from './database.logger';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: 'default',
      useFactory: (configService: ConfigService) => {
        return Object.assign(
          {
            name: configService.get<string>('TYPEORM_NAME'),
            type: configService.get<'postgres'>('TYPEORM_TYPE'),
            host: configService.get<string>('TYPEORM_HOST'),
            port: configService.get<number>('TYPEORM_PORT'),
            cache: configService.get<boolean>('TYPEORM_CACHE'),
            logger: new DatabaseLogger(configService.get('TYPEORM_LOGGING')),
            database: configService.get<string>('TYPEORM_DATABASE'),
            username: configService.get<string>('TYPEORM_USERNAME'),
            password: configService.get<string>('TYPEORM_PASSWORD'),
            dropSchema: configService.get<boolean>('TYPEORM_DROP_SCHEMA'),
            synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
            migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN'),
            poolSize: configService.get<number>('TYPEORM_POOL_SIZE'),
            ssl: configService.get<boolean>('TYPEORM_SSL'),
            entities: [dirname(__dirname) + '/modules/**/*.entity.{ts,js}'],
            migrations: [__dirname + '/migrations/*.{ts,js}'],
          } as TypeOrmModuleOptions,
          configService.getMode(ConfigMode.production) &&
            ({
              extra: {
                ssl: { rejectUnauthorized: configService.get<boolean>('TYPEORM_SSL_SELF') },
              },
            } as TypeOrmModuleOptions),
        );
      },
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DatabaseModule {}
