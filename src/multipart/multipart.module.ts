import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Module, DynamicModule, Provider, Global } from '@nestjs/common';

import { MULTIPART_MODULE_OPTIONS, MULTIPART_MODULE } from './multipart.constants';
import { StorageService } from './storage.service';
import {
  MultipartModuleAsyncOptions,
  MultipartOptionsFactory,
  MultipartModuleOptions,
} from './interfaces';

/**
 * [description]
 */
@Global()
@Module({})
export class MultipartModule {
  /**
   * [description]
   * @param  options [description]
   * @return         [description]
   */
  static register(options: MultipartModuleOptions = {}): DynamicModule {
    return {
      module: MultipartModule,
      providers: [
        { provide: MULTIPART_MODULE_OPTIONS, useValue: options },
        { provide: MULTIPART_MODULE, useValue: randomStringGenerator() },
        { provide: StorageService, useClass: StorageService },
      ],
      exports: [MULTIPART_MODULE, MULTIPART_MODULE_OPTIONS, StorageService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  public static registerAsync(options: MultipartModuleAsyncOptions): DynamicModule {
    return {
      module: MultipartModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        { provide: MULTIPART_MODULE, useValue: randomStringGenerator() },
        { provide: StorageService, useClass: StorageService },
      ],
      exports: [MULTIPART_MODULE, MULTIPART_MODULE_OPTIONS, StorageService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncProviders(options: MultipartModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncOptionsProvider(options: MultipartModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: MULTIPART_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MULTIPART_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MultipartOptionsFactory) =>
        optionsFactory.createMultipartOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
