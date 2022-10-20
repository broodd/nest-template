import { Injectable, NotFoundException } from '@nestjs/common';
import { PromiseResult } from 'aws-sdk/lib/request';
import { extname as extName } from 'node:path';
import { MultipartFile } from '@fastify/multipart';
import { AWSError } from 'aws-sdk/lib/error';
import { randomBytes } from 'node:crypto';
import { S3 } from 'aws-sdk';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { UploadedFile } from './dto';

type PutObjectRequest = Omit<S3.Types.PutObjectRequest, 'Bucket'>;
type HeadObjectRequest = Omit<S3.Types.HeadObjectRequest, 'Bucket'>;

/**
 * [description]
 */
@Injectable()
export class StorageService {
  private readonly s3: S3;
  private readonly bucket: S3.BucketName;

  /**
   * [description]
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3();
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  /**
   * [description]
   */
  public generateName(): string {
    const filename = randomBytes(16).toString('hex');
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}/${month}/${filename}`;
  }

  /**
   * [description]
   * @param options
   */
  public async uploadOne(options: PutObjectRequest): Promise<S3.ManagedUpload.SendData> {
    return this.s3.upload({ ...options, Bucket: this.bucket }).promise();
  }

  /**
   * [description]
   * @param options
   */
  public async selectHeadOne(
    options: HeadObjectRequest,
  ): Promise<PromiseResult<S3.HeadObjectOutput, AWSError>> {
    return this.s3.headObject({ ...options, Bucket: this.bucket }).promise();
  }

  /**
   * [description]
   * @param multipart
   */
  public async createOne(multipart: MultipartFile): Promise<UploadedFile> {
    const { file, encoding, mimetype } = multipart;
    const extname = extName(multipart.filename);
    const filename = this.generateName();

    try {
      const Key = filename + extname;
      await this.uploadOne({ Key, Body: file, ContentType: mimetype });
      const { ContentLength: size } = await this.selectHeadOne({ Key });

      return new UploadedFile({
        filename,
        mimetype,
        encoding,
        extname,
        title: multipart.filename,
        fileSize: size.toString(),
      });
    } catch {
      this.deleteOne(filename);
    }
  }

  /**
   * [description]
   * @param Key
   */
  public async deleteOne(
    Key: S3.ObjectKey,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    return this.s3
      .deleteObject({ Key, Bucket: this.bucket })
      .promise()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      });
  }
}
