import { FastifyReply } from 'fastify';

import {
  BadRequestException,
  Controller,
  UseGuards,
  Param,
  Query,
  Body,
  Post,
  Get,
  Res,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { toNestedBySeparator } from 'src/common/helpers';
import { ErrorTypeEnum } from 'src/common/enums';
import { UseRole } from 'src/common/decorators';

import { UsersService } from 'src/modules/users/services';
import { UserEntity } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { UserRoleEnum } from 'src/modules/users/enums';

import { SendmailTemplateContextFactory, SendMailService } from '../services';
import { SelectTemplateDto } from '../dto/select-template.dto';
import { TemplateNameEnum } from '../enums';
import { MailType } from '../types';

/**
 * [description]
 */
@ApiTags('sendmail/templates')
@Controller('sendmail/templates')
export class SendmailTemplatesController {
  /**
   * [description]
   * @param sendMailService
   * @param templateCtx
   * @param usersService
   */
  constructor(
    public readonly sendMailService: SendMailService,
    public readonly templateCtx: SendmailTemplateContextFactory,
    public readonly usersService: UsersService,
  ) {}

  /**
   * [description]
   * @param conditions
   */
  public async selectOneUserWithProfile(conditions: FindManyBracketsOptions<UserEntity>['where']) {
    return this.usersService.selectOne(conditions, { loadEagerRelations: true });
  }

  /**
   * [description]
   */
  @Get(':template/users/:email')
  public async selectOneByHbs(
    @Param() conditions: SelectTemplateDto,
    @Query() options: any,
    @Res() res: FastifyReply,
  ) {
    try {
      const user = await this.selectOneUserWithProfile({ email: conditions.email });

      const contextMethod = this.templateCtx['build_' + conditions.template];
      const context: MailType = contextMethod.call(
        this.templateCtx,
        user,
        toNestedBySeparator(options),
      );

      const html = await this.sendMailService.compileHbsTemplate(context.template, context.context);

      return res.status(200).header('Content-Type', 'text/html').send(html);
    } catch (error) {
      this.usersService.throwError(BadRequestException, ErrorTypeEnum.INPUT_DATA_ERROR, error);
    }
  }

  /**
   * [description]
   */
  @Get('mjml/:template/users/:email')
  public async selectOneByMjml(
    @Param() conditions: SelectTemplateDto,
    @Query() options: any,
    @Res() res: FastifyReply,
  ) {
    const fileName = TemplateNameEnum[conditions.template] + '.mjml';
    try {
      await this.sendMailService.transformOneMjmlTemplateToHbs(fileName);
    } catch {
      await this.sendMailService.transformOneMjmlTemplateToHbs(
        TemplateNameEnum.BASE_LAYOUT + '.mjml',
      );
    }

    return this.selectOneByHbs(conditions, options, res);
  }

  /**
   * [description]
   */
  @ApiCookieAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @UseRole(UserRoleEnum.ADMIN)
  @Post('send/:template/users/:email')
  public async sendOneByTemplate(@Param() conditions: SelectTemplateDto, @Body() data: any) {
    const user = await this.selectOneUserWithProfile({ email: conditions.email });

    const contextMethod = this.templateCtx['build_' + conditions.template];
    const context: MailType = contextMethod.call(this.templateCtx, user, data);

    return this.sendMailService.sendTemplatedMail(context);
  }
}
