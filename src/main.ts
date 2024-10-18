import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { NestFactory } from '@nestjs/core';

import basicAuth from '@fastify/basic-auth';
import multipart from '@fastify/multipart';
import compress from '@fastify/compress';
import helmet from '@fastify/helmet';

import { HttpExceptionFilter } from './common/filters';
import { ConfigMode, ConfigService } from './config';

import { AppModule } from './app.module';
import { validationPipe } from './common/pipes';

/**
 * [description]
 */
async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);

  const exceptionFilter = new HttpExceptionFilter();

  await app.register(compress, { encodings: ['gzip', 'deflate'] });
  await app.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: configService.get<number>('STORE_FILE_SIZE'),
    },
  });
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  initializeApp({
    credential: credential.cert({
      clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
      projectId: configService.get('FIREBASE_PROJECT_ID'),
      privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  });

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();
  if (configService.get('SWAGGER_MODULE')) {
    const config = new DocumentBuilder()
      .setVersion(configService.get('npm_package_version'))
      .setTitle(configService.get('npm_package_name'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    if (configService.get('SWAGGER_LOGIN')) {
      const swaggerUsername = configService.get<string>('SWAGGER_USERNAME');
      const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD');
      await app.register(basicAuth, {
        validate: (username, password, _req, _reply, done) =>
          username === swaggerUsername && password === swaggerPassword ? done() : done(new Error()),
        authenticate: true,
      });

      const instance: any = app.getHttpAdapter().getInstance();
      instance.addHook('onRequest', (request, reply, done) =>
        request.url === '/' ? instance.basicAuth(request, reply, done) : done(),
      );
    }
  }

  return app
    .useGlobalPipes(validationPipe)
    .useGlobalFilters(exceptionFilter)
    .listen(configService.get('PORT'), configService.get('HOST'));
}

bootstrap();
