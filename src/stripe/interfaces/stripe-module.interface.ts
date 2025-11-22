import Stripe from 'stripe';

import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

import { StripeProductsType } from './stripe-products.interface';

/**
 * [description]
 */

export interface StripeModuleOptions {
  readonly apiKey: string;
  readonly products: StripeProductsType;
  readonly webhookSecret: string;
  readonly config?: Stripe.StripeConfig;
}

/**
 * [description]
 */
export interface StripeModuleOptionsFactory {
  createStripeOptions(): Promise<StripeModuleOptions> | StripeModuleOptions;
}

/**
 * [description]
 */
export interface StripeModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<StripeModuleOptionsFactory>;
  useExisting?: Type<StripeModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<StripeModuleOptions> | StripeModuleOptions;
}
