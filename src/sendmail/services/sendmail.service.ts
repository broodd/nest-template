import { writeFile, readFile, readdir } from 'node:fs/promises';
import { basename, resolve, join } from 'node:path';

import { Queue } from 'bull';
import mjml2html from 'mjml';

import { BadGatewayException, OnModuleInit, Injectable, Inject, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { QueueEventConfigType } from 'src/common/queues/types';
import { handlebarsCompile } from 'src/common/helpers';

import { ConfigService, ConfigMode } from 'src/config';

import {
  ISendmailTransportSendOptions,
  ISendmailTransport,
} from '../transports/interfaces/transport.interface';
import { SENDMAIL_TRANSPORT } from '../sendmail.constants';
import { SENDMAIL_QUEUE } from '../queues/constants';
import { TemplateNameEnum } from '../enums';
import { MailType } from '../types';

import { SendmailTemplateContextFactory } from './sendmail-template-context.factory';

/**
 * [description]
 */
@Injectable()
export class SendMailService implements OnModuleInit {
  /**
   * [description]
   */
  private readonly logger = new Logger(SendMailService.name);
  private readonly from: string;
  private readonly templatesDir: string;
  private readonly templatesMjmlDir: string;

  /**
   * [description]
   * @param sendMailQueue
   * @param transport
   * @param config
   * @param templateCtx
   */
  constructor(
    @InjectQueue(SENDMAIL_QUEUE.name)
    private readonly sendMailQueue: Queue,

    @Inject(SENDMAIL_TRANSPORT)
    private readonly transport: ISendmailTransport,

    public readonly config: ConfigService,
    public readonly templateCtx: SendmailTemplateContextFactory,
  ) {
    if (this.config.getMode(ConfigMode.development)) {
      this.templatesDir = join(__dirname, '../../../src/sendmail/templates');
    } else {
      this.templatesDir = join(__dirname, '../templates');
    }

    this.templatesMjmlDir = join(this.templatesDir, 'mjml');
    this.from = config.get('SENDMAIL_FROM');
  }

  /**
   * Transform mjml templates when mode development and dist not exists
   */
  async onModuleInit(): Promise<void> {
    // await this.transformMjmlTemplatesToHbs();
  }

  /**
   * Transform mjml templates from folder ./templates/mjml
   * to hbs in folder ./templates
   */
  private async transformAllMjmlTemplatesToHbs() {
    const files = await readdir(this.templatesMjmlDir).then((files) =>
      files.filter((file) => file.endsWith('.mjml')),
    );

    const promises = files.map(async (fileName) => {
      await this.transformOneMjmlTemplateToHbs(fileName);
    });

    await Promise.all(promises);
  }

  /**
   * Transform mjml one templates from folder ./templates/mjml
   * to hbs in folder ./templates
   */
  public async transformOneMjmlTemplateToHbs(fileName: string) {
    const filePath = join(this.templatesMjmlDir, fileName);
    const newFileName = basename(fileName, '.mjml') + '.hbs';
    const newFilePath = resolve(this.templatesDir, newFileName);

    const mjmlContent = await readFile(filePath, 'utf-8');
    const compiled = mjml2html(mjmlContent, { filePath: this.templatesMjmlDir, beautify: true });
    await writeFile(newFilePath, compiled.html, 'utf-8');
  }

  /**
   * [description]
   * @param templateName
   * @param context
   */
  public async compileHbsTemplate(
    templateName: TemplateNameEnum,
    context: MailType['context'],
  ): Promise<string> {
    const templatePath = resolve(this.templatesDir, `${templateName}.hbs`);
    const templateSource = await readFile(templatePath, 'utf8');

    return handlebarsCompile(templateSource, context);
  }

  /**
   * [description]
   * @param data
   */
  public async sendMailByQueue<T extends Partial<MailType>>(
    data: T,
    jobOptions?: QueueEventConfigType['options'],
  ): Promise<void> {
    if (!data.to.length) return;

    const jobCofig = SENDMAIL_QUEUE.events.sendMail;
    const options = Object.assign({}, jobCofig.options, jobOptions);

    await this.sendMailQueue.add(jobCofig.name, data, options).catch((error) => {
      this.logger.error(error);
      throw new BadGatewayException(error);
    });
  }

  /**
   * [description]
   * @param jobId
   */
  public async deleteSendMailJob(jobId: string): Promise<void> {
    const job = await this.sendMailQueue.getJob(jobId);
    if (job) await job.remove();
  }

  /**
   * [description]
   * @param data
   */
  public async sendTemplatedMail<T extends Partial<MailType>>(data: T): Promise<Partial<MailType>> {
    if (!data.to.length) return;

    if (!this.config.getMode(ConfigMode.production)) {
      console.log('EMAIL TO:', data.to, data.template, data.context);
      return data;
    }

    const html = await this.compileHbsTemplate(data.template, data.context);
    const options: ISendmailTransportSendOptions = {
      html,
      to: data.to,
      subject: data.subject,
      from: this.from,
    };

    await this.transport.sendMail(options).catch((error) => {
      this.logger.error(error);
      throw new BadGatewayException(error);
    });
  }
}
