import { PayloadTooLargeException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { BusboyConfig } from 'busboy';

import { ErrorTypeEnum } from 'src/common/enums';
import { FileValidationPipe } from '../pipes';

/**
 * [description]
 * @param options
 * @param ctx
 */
export const FileDecorator = createParamDecorator(
  async (
    options: Omit<BusboyConfig, 'headers'> = { limits: { fileSize: 5e6 } },
    ctx: ExecutionContext,
  ): Promise<MultipartFile> => {
    const request = ctx.switchToHttp().getRequest<
      FastifyRequest & {
        file: (options?: Omit<BusboyConfig, 'headers'>) => Promise<MultipartFile>;
      }
    >();
    return request.file(options).catch(() => {
      throw new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);
    });
  },
);

/**
 * [description]
 * @param options
 */
export const File = (options: Omit<BusboyConfig, 'headers'> = { limits: { fileSize: 5e6 } }) =>
  FileDecorator(options, FileValidationPipe);
