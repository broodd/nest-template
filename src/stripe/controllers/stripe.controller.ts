import { FastifyRequest, FastifyReply } from 'fastify';
import { Queue } from 'bull';
import Stripe from 'stripe';

import {
  RawBodyRequest,
  Controller,
  UseGuards,
  Headers,
  Inject,
  Logger,
  Query,
  Body,
  Post,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';

import { QueueEventConfigType } from 'src/common/queues/types';
import { User } from 'src/common/decorators';

import { ConfigService } from 'src/config';

import { LogErrorsService } from 'src/modules/logs/services';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { ReqAuthUserDto } from 'src/modules/auth/dto';

import { CreateCheckoutSessionCourseBookDto } from '../dto/checkout-session.dto';
import { STRIPE_MODULE_OPTIONS } from '../stripe.constants';
import { StripeModuleOptions } from '../interfaces';
import { StripeService } from '../services';
import { STRIPE_QUEUE } from '../queues';
import { JobSessionDto } from '../dto';

/**
 * [description]
 */

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  /**
   * [description]
   */
  private readonly logger: Logger = new Logger(StripeController.name);
  private readonly webhookSecret: string;

  /**
   * [description]
   * @param stripeService
   * @param configService
   * @param logErrorsService
   * @param stripeQueue
   */
  constructor(
    public readonly stripeService: StripeService,
    public readonly configService: ConfigService,
    public readonly logErrorsService: LogErrorsService,
    @Inject(STRIPE_MODULE_OPTIONS)
    public readonly options: StripeModuleOptions,
    @InjectQueue(STRIPE_QUEUE.name)
    private readonly stripeQueue: Queue,
  ) {
    this.webhookSecret = options.webhookSecret;
  }

  /**
   * [description]
   * @param user
   */
  @ApiCookieAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post('checkout/course_book')
  public async createCourseBookCheckoutSession(
    @Body() metadata: CreateCheckoutSessionCourseBookDto,
    @User() user: ReqAuthUserDto,
  ): Promise<string> {
    const product = this.stripeService.products.course_book;
    const price = await this.stripeService.selectOnePrice(product);

    const session = await this.stripeService.createCheckoutSession(
      product,
      [{ price: price.id, quantity: 1 }],
      user,
      metadata,
    );
    return session.url;
  }

  /**
   * [description]
   * @param session_id
   */
  @ApiCookieAuth('accessToken')
  @Get('queue/jobs')
  @UseGuards(JwtAuthGuard)
  public async selectJobSession(@Query('session_id') session_id: string): Promise<JobSessionDto> {
    const job = await this.stripeQueue.getJob(session_id);
    if (!job || !job.data.key) return { state: 'not_found' };

    return {
      state: await job.getState(),
      timestamp: job.timestamp,
      returnValue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  /**
   * [description]
   * @param signature
   * @param req
   * @param res
   */
  @ApiExcludeEndpoint()
  @Post('webhook/queue')
  public async handleWebhookByQueue(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Res() res: FastifyReply,
  ) {
    /**
     * Immediately acknowledge to stripe
     * This prevents to retrying attempts the webhook too soon.
     */
    res.status(200).send();
    //

    try {
      const event: Stripe.Event = this.stripeService.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.webhookSecret,
      );

      const jobCofig: QueueEventConfigType = Object.assign({}, STRIPE_QUEUE.events[event.type]);
      if (!jobCofig.name) {
        this.logger.log('Unhandled event type: ' + event.type);
        return;
      }

      const session = event.data.object as Stripe.Checkout.Session;

      /**
       * jobCofig.name: StripeProductEventEnum
       */
      jobCofig.name = jobCofig.name + ':' + session.metadata.key;
      jobCofig.options.jobId = session.id;

      await this.stripeQueue.add(
        jobCofig.name,
        { id: event.id, key: jobCofig.name },
        jobCofig.options,
      );
    } catch (error) {
      this.logger.error(error, req.rawBody);

      await this.logErrorsService
        .createOne({
          url: 'webhook/queue/error',
          body: this.logErrorsService.sanitizeBody(req.body),
          error: error.message,
        })
        .catch(() => {});
    }
  }
}
