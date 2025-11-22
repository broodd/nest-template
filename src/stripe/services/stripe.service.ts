import Stripe from 'stripe';

import { BadGatewayException, Injectable, Inject } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { ConfigService } from 'src/config';

import { UserEntity } from 'src/modules/users/entities';

import { StripeModuleOptions, StripeProductsType, StripeProductType } from '../interfaces';
import { STRIPE_MODULE_OPTIONS } from '../stripe.constants';

/**
 * [description]
 */
@Injectable()
export class StripeService {
  /**
   * [description]
   */
  public readonly stripe: Stripe;

  /**
   * [description]
   */
  public readonly products: StripeProductsType;

  /**
   * [description]
   */
  public readonly clientURL = this.configService.get<string>('CLIENT_URL');

  /**
   * [description]
   * @param options
   * @param configService
   */
  constructor(
    @Inject(STRIPE_MODULE_OPTIONS)
    public readonly options: StripeModuleOptions,
    public readonly configService: ConfigService,
  ) {
    const { apiKey, config, products } = this.options;
    this.stripe = new Stripe(apiKey, config);
    this.products = products;
  }

  /**
   * Select one active price
   * @param product
   */
  public async selectOnePrice(product: StripeProductType) {
    const prices = await this.stripe.prices.list({
      product: product.id,
      active: true,
      limit: 1,
    });
    const price = prices.data[0];

    if (!price)
      throw new BadGatewayException(ErrorTypeEnum.STRIPE_API_INVALID_DATA, 'Price not found');
    return price;
  }

  /**
   * Search one price by metadata, useful for found prudct price with **discount_type**
   * @param product
   * @param searchMetadata
   */
  public async selectOnePriceByMetadata(
    product: StripeProductType,
    searchMetadata: Record<string, unknown>,
  ) {
    const metadata = Object.assign({}, searchMetadata);

    let query = `product:'${product.id}' AND active:'true'`;
    Object.entries(metadata).forEach(([key, value]) => {
      query += ` AND metadata['${key}']:'${value}'`;
    });

    const prices = await this.stripe.prices.search({
      query,
      limit: 1,
    });
    const price = prices.data[0];

    if (!price)
      throw new BadGatewayException(ErrorTypeEnum.STRIPE_API_INVALID_DATA, 'Price not found');
    return price;
  }

  /**
   * [description]
   * @param priceId
   * @param user
   * @param metadata
   */
  public async createCheckoutSession(
    product: StripeProductType,
    items: Array<Stripe.Checkout.SessionCreateParams.LineItem>,
    user: Partial<UserEntity>,
    metadata?: any,
  ): Promise<Stripe.Checkout.Session> {
    const success_url = new URL(product.success_url, this.clientURL).toString();
    const cancel_url = new URL(product.cancel_url, this.clientURL).toString();

    return this.stripe.checkout.sessions.create({
      payment_intent_data: {
        receipt_email: user.email,
      },
      customer_email: user.email,
      mode: 'payment',
      metadata: { userId: user.id, key: product.key, ...metadata },
      line_items: items,
      success_url: success_url + '?session_id={CHECKOUT_SESSION_ID}&payment_type=' + product.key,
      cancel_url,
    });
  }
}
