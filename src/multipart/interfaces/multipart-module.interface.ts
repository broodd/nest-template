import { FastifyMultipartOptions } from 'fastify-multipart';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

/**
 * [description]
 */
export type MultipartModuleOptions = FastifyMultipartOptions;

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
