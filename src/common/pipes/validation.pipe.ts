import { ValidationPipe } from '@nestjs/common';

/**
 * [description]
 */
export const validationPipe = new ValidationPipe({
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
