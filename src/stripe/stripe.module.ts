import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DynamicModule, Provider, Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import {
  StripeModuleOptionsFactory,
  StripeModuleAsyncOptions,
  StripeModuleOptions,
} from './interfaces';
import { STRIPE_MODULE_OPTIONS, STRIPE_MODULE } from './stripe.constants';
import { StripeProcessor, STRIPE_QUEUE } from './queues';
import { StripeController } from './controllers';
import { StripeService } from './services';

/**
 * [description]
 */
export const StripeQueueModule = BullModule.registerQueue({
  defaultJobOptions: STRIPE_QUEUE.defaultJobOptions,
  name: STRIPE_QUEUE.name,
});

/**
 * [description]
 */
@Global()
@Module({})
export class StripeModule {
  /**
   * [description]
   * @param  options [description]
   * @return         [description]
   */
  public static register(options: StripeModuleOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: [StripeQueueModule],
      controllers: [StripeController],
      providers: [
        { provide: STRIPE_MODULE_OPTIONS, useValue: options },
        { provide: STRIPE_MODULE, useValue: randomStringGenerator() },
        StripeService,
        StripeProcessor,
      ],
      exports: [STRIPE_MODULE, STRIPE_MODULE_OPTIONS, StripeService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  static registerAsync(options: StripeModuleAsyncOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: [...(options.imports || []), StripeQueueModule],
      controllers: [StripeController],
      providers: [
        ...this.createAsyncProviders(options),
        { provide: STRIPE_MODULE, useValue: randomStringGenerator() },
        StripeService,
        StripeProcessor,
      ],
      exports: [STRIPE_MODULE, STRIPE_MODULE_OPTIONS, StripeService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncProviders(options: StripeModuleAsyncOptions): Provider[] {
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
  private static createAsyncOptionsProvider(options: StripeModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: STRIPE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: STRIPE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: StripeModuleOptionsFactory) =>
        optionsFactory.createStripeOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
