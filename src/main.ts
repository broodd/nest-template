import { initializeTransactionalContext } from 'typeorm-transactional';
import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import compress from '@fastify/compress';
import helmet from '@fastify/helmet';

import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { RoleSerializationInterceptor, AddUserIdInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import { validationPipe } from './common/pipes';

import { ErrorLogsInterceptor, LogErrorsService } from './modules/logs/services';
import { ConfigService, ConfigMode } from './config';
import { AppModule } from './app.module';
import { swaggerSetup } from './swagger';

/**
 * [description]
 */
async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  await app.register(compress, { encodings: ['gzip', 'deflate'] });
  await app.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: Infinity,
    },
    // throwFileSizeLimit: true,
  });
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
  await app.register(fastifyCookie);

  app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();

  await swaggerSetup(app, configService);

  /**
   * Error logs, which save to DB table
   */
  const errorLogsService = app.get(LogErrorsService);
  app.useGlobalInterceptors(new ErrorLogsInterceptor(errorLogsService));

  const exceptionFilter = new HttpExceptionFilter();

  return (
    app
      .useGlobalPipes(validationPipe)
      .useGlobalFilters(exceptionFilter)
      .useGlobalInterceptors(
        new AddUserIdInterceptor(),
        new RoleSerializationInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
      )
      // .useGlobalGuards(app.get(LimitAttemptsGuard))
      .listen(configService.get('PORT'), configService.get('HOST'))
  );
}

bootstrap();
