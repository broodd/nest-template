import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { extname as extName, join } from 'node:path';
import { Upload } from '@aws-sdk/lib-storage';
import { randomBytes } from 'node:crypto';
import {
  CompleteMultipartUploadCommandOutput,
  AbortMultipartUploadCommandOutput,
  DeleteObjectCommandOutput,
  ListObjectsCommandOutput,
  HeadObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { toPromiseArrayFromIterator } from 'src/common/helpers';
import { MultipartBodyFile } from 'src/multipart/interfaces';
import { ErrorTypeEnum } from 'src/common/enums';

import { MULTIPART_MODULE_OPTIONS } from './multipart.constants';
import { MultipartModuleOptions } from './interfaces';
import { UploadedFile } from './dto';

/**
 * [description]
 */
@Injectable()
export class StorageService {
  /**
   * [description]
   */
  private readonly rootDir = 'uploads';

  /**
   * [description]
   */
  private readonly s3: S3Client = new S3Client(this.options);

  /**
   * [description]
   * @param options
   */
  constructor(
    @Inject(MULTIPART_MODULE_OPTIONS)
    public readonly options: MultipartModuleOptions,
  ) {}

  /**
   * [description]
   */
  public generateName(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * [description]
   */
  public generateDatePrefix(key?: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}/${month}/${key}`;
  }

  /**
   * [description]
   */
  private addRootDir(key: string): string {
    return `${this.rootDir}/${key}`;
  }

  /**
   * [description]
   * @param options
   */
  public async uploadOne({
    encoding,
    mimetype,
    data,
    key,
  }: Partial<UploadedFile>): Promise<
    AbortMultipartUploadCommandOutput | CompleteMultipartUploadCommandOutput
  > {
    try {
      return new Upload({
        client: this.s3,
        params: {
          ContentEncoding: encoding,
          ContentType: mimetype,
          Bucket: this.options.bucket,
          Body: data,
          Key: this.addRootDir(key),
        },
      }).done();
    } catch {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param key
   */
  public async selectHeadOne(key: string): Promise<HeadObjectCommandOutput> {
    try {
      const command = new HeadObjectCommand({
        Key: this.addRootDir(key),
        Bucket: this.options.bucket,
      });
      return this.s3.send(command);
    } catch {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param prefix
   */
  public async selectListObjects(prefix: string): Promise<ListObjectsCommandOutput> {
    try {
      const command = new ListObjectsCommand({
        Bucket: this.options.bucket,
        Prefix: this.addRootDir(prefix),
      });
      return this.s3.send(command);
    } catch {
      throw new NotFoundException(ErrorTypeEnum.FILES_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param multipartFiles
   * @param paths
   */
  public async createMany(
    multipartFiles: AsyncIterableIterator<MultipartBodyFile>,
    ...paths: string[]
  ): Promise<UploadedFile[]> {
    const files = await toPromiseArrayFromIterator<MultipartBodyFile>(multipartFiles);
    return Promise.all(files.map((file) => this.createOne(file, ...paths)));
  }

  /**
   * [description]
   * @param multipart
   */
  public async createOne(multipart: MultipartBodyFile, ...paths: string[]): Promise<UploadedFile> {
    multipart.filename = multipart.filename.replace(/([^\w|\-\.\/]|)/g, '');

    const extname = extName(multipart.filename);
    const { filename, data, encoding, mimetype } = multipart;

    let key = multipart.key;
    if (!multipart.key) {
      const generatedKey = this.generateDatePrefix(this.generateName()) + extname;
      key = join(...paths, generatedKey).replace(/\\/g, '/');
    }

    try {
      await this.uploadOne({ key, data, mimetype, encoding });
      const { ContentLength: size } = await this.selectHeadOne(key);

      return new UploadedFile({
        filename,
        key,
        mimetype,
        encoding,
        extname,
        fileSize: size.toString(),
      });
    } catch {
      await this.deleteOne(this.addRootDir(key));
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param paths
   */
  public deleteOne(...paths: string[]): Promise<DeleteObjectCommandOutput> {
    try {
      const key = join(...paths).replace(/\\/g, '/');
      const command = new DeleteObjectCommand({
        Key: this.addRootDir(key),
        Bucket: this.options.bucket,
      });
      return this.s3.send(command);
    } catch {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    }
  }

  /**
   * [description]
   * @param paths
   */
  public async deleteManyInFolder(...paths: string[]): Promise<DeleteObjectCommandOutput> {
    try {
      const key = join(...paths).replace(/\\/g, '/');
      const objects = await this.selectListObjects(key);
      if (!objects.Contents?.length) return;

      const deleteObjects = objects.Contents.map(({ Key }) => ({ Key }));
      const command = new DeleteObjectsCommand({
        Delete: { Objects: deleteObjects },
        Bucket: this.options.bucket,
      });

      return this.s3.send(command);
    } catch {
      throw new ForbiddenException(ErrorTypeEnum.FILES_NOT_FOUND);
    }
  }
}
