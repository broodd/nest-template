import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

import { S3ClientConfig } from '@aws-sdk/client-s3';

/**
 * [description]
 */
export interface MultipartModuleOptions extends S3ClientConfig {
  readonly bucket?: string;
}

/**
 * [description]
 */
export interface MultipartOptionsFactory {
  /**
   * [description]
   */
  createMultipartOptions(): Promise<MultipartModuleOptions> | MultipartModuleOptions;
}

/**
 * [description]
 */
export interface MultipartModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * [description]
   */
  useExisting?: Type<MultipartOptionsFactory>;

  /**
   * [description]
   */
  useClass?: Type<MultipartOptionsFactory>;

  /**
   * [description]
   */
  useFactory?: (...args: any[]) => Promise<MultipartModuleOptions> | MultipartModuleOptions;

  /**
   * [description]
   */
  inject?: any[];
}
