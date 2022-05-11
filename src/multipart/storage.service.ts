import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ReadStream, createWriteStream, createReadStream } from 'fs';
import { stat, mkdir, unlink } from 'fs/promises';
import { Multipart } from 'fastify-multipart';
import { pipeline } from 'stream/promises';
import { BusboyConfig } from 'busboy';
import { randomBytes } from 'crypto';
import { join, extname } from 'path';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { MULTIPART_MODULE_OPTIONS } from './multipart.constants';
import { UploadedFile } from './dto';

/**
 * [description]
 */
@Injectable()
export class StorageService implements OnModuleInit {
  /**
   * [description]
   */
  private readonly options = {
    mode: parseInt('0700', 8),
  };

  /**
   * [description]
   */
  private readonly destination: string;

  /**
   * [description]
   * @param configService [description]
   * @param busboyConfig
   */
  constructor(
    private readonly configService: ConfigService,
    @Inject(MULTIPART_MODULE_OPTIONS)
    public readonly busboyConfig?: BusboyConfig,
  ) {
    this.destination = this.configService.getDest('STORE_DEST');
  }

  /**
   * [description]
   */
  public async onModuleInit(): Promise<void> {
    if (await !stat(this.destination)) await mkdir(this.destination, this.options);
  }

  /**
   * [description]
   */
  public generateName(): { prefix: string; filename: string } {
    const filename = randomBytes(16).toString('hex');
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const prefix = `${year}/${month}`;
    return { prefix, filename: `${prefix}/${filename}` };
  }

  /**
   * [description]
   * @param multipart
   */
  public async createOne(multipart: Multipart): Promise<UploadedFile> {
    const { file, encoding, mimetype } = multipart;
    const { prefix, filename } = this.generateName();
    const filePath = join(this.destination, filename);
    const ext = extname(multipart.filename);

    try {
      await mkdir(join(this.destination, prefix), { recursive: true });
      await pipeline(file, createWriteStream(filePath, this.options));
      const { size } = await stat(filePath);
      return new UploadedFile({
        filename,
        mimetype,
        encoding,
        extname: ext,
        title: multipart.filename,
        fileSize: size.toString(),
      });
    } catch {
      this.deleteOne(filename);
    }
  }

  /**
   * [description]
   * @param file    [description]
   * @param options
   */
  public async selectOne(file: Partial<Multipart>, options: any = {}): Promise<ReadStream> {
    try {
      const fileDest = join(this.destination, file.filename);
      await stat(fileDest);
      return createReadStream(fileDest, { emitClose: false, ...options });
    } catch {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param filename {string} [description]
   * @return {void}
   */
  public async deleteOne(filename: string): Promise<void> {
    const fileDest = join(this.destination, filename);
    return unlink(fileDest).catch(() => {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    });
  }
}
