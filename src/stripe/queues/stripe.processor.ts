import { Transactional } from 'typeorm-transactional';
import Stripe from 'stripe';
import { Job } from 'bull';

import { OnQueueFailed, Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { LogErrorsService } from 'src/modules/logs/services';

import { CourseBookMetadata } from '../interfaces';
import { StripeProductEventEnum } from '../enums';
import { StripeService } from '../services';

import { STRIPE_QUEUE } from './stripe-queue.constants';

/**
 * [description]
 */
@Processor(STRIPE_QUEUE.name)
export class StripeProcessor {
  /**
   * [description]
   */
  private readonly logger = new Logger(StripeProcessor.name);

  /**
   * [description]
   * @param stripeService
   */
  constructor(
    private readonly stripeService: StripeService,
    private readonly logErrorsService: LogErrorsService,
  ) {}

  /**
   * [description]
   * @param job
   * @param error
   */
  @OnQueueFailed()
  async onFailure(job: Job, error: any) {
    this.logger.error(`Failed job #${job.id} of type ${job.name}: ${error.message}`, job.data);
    await this.logErrorsService
      .createOne({
        url: job.name,
        params: job.id,
        body: job.data,
        error: error.message,
      })
      .catch(() => {});
  }

  /**
   * [description]
   * @param job
   */
  @Transactional()
  @Process(StripeProductEventEnum.CHECKOUT_SESSION_COMPLETED__COURSE_BOOK)
  public async handleCheckoutComplete_CourseBook(job: Job<any>): Promise<any> {
    const event: Stripe.Response<Stripe.Event> = await this.stripeService.stripe.events.retrieve(
      job.data.id,
    );
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as unknown as CourseBookMetadata;
    const bookOrderId = metadata.bookOrderId;

    // ...
    return bookOrderId;
  }
}
