import { dirname } from 'node:path';

import { DataSource } from 'typeorm';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService } from 'src/config';

import { DatabaseLogger } from './database.logger';

const configService = new ConfigService();

export const AppDataSource = new DataSource(
  Object.assign({
    name: configService.get<string>('TYPEORM_NAME'),
    type: configService.get<'postgres'>('TYPEORM_TYPE'),
    host: configService.get<string>('TYPEORM_HOST'),
    port: configService.get<number>('TYPEORM_PORT'),
    cache: configService.get<boolean>('TYPEORM_CACHE'),
    logger: new DatabaseLogger(configService.get('TYPEORM_LOGGING')),
    database: configService.get<string>('TYPEORM_DATABASE'),
    username: configService.get<string>('TYPEORM_USERNAME'),
    password: configService.get<string>('TYPEORM_PASSWORD'),
    dropSchema: false,
    synchronize: false,
    migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN'),
    poolSize: configService.get<number>('TYPEORM_POOL_SIZE'),
    ssl: configService.get<boolean>('TYPEORM_SSL'),
    entities: [dirname(__dirname) + '/modules/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
  } as TypeOrmModuleOptions),
);
