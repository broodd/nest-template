import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Patch,
  Query,
  Param,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { FindOneOptionsDto, ID } from 'src/common/dto';
import { User } from 'src/common/decorators';

import { UserEntity } from '../../users/entities';
import { JwtAuthGuard } from '../../auth/guards';

import { NotificationsService } from '../services';
import { NotificationEntity } from '../entities';
import {
  PaginationNotificationsDto,
  SelectNotificationsDto,
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../dto';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('notifications')
@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationsController {
  /**
   * [description]
   * @param notificationsService
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post()
  public async sendAndCreateOne(
    @Body() data: CreateNotificationDto,
    @User() owner: UserEntity,
  ): Promise<NotificationEntity> {
    return this.notificationsService.sendAndCreateOneForOne(
      { owner: { id: owner.id } },
      { ...data, owner: { id: owner.id } },
    );
  }

  /**
   * [description]
   * @param options
   * @param owner
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectNotificationsDto,
    @User() owner: UserEntity,
  ): Promise<PaginationNotificationsDto> {
    options.ownerId = owner.id;
    const data = await this.notificationsService.selectManyAndCount(options);
    await this.notificationsService.update(
      { ownerId: owner.id, readAt: IsNull() },
      { readAt: new Date() },
    );
    return data;
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   * @param options
   */
  @Get(':id')
  public async selectOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
    @Query() options?: FindOneOptionsDto<NotificationEntity>,
  ): Promise<NotificationEntity> {
    return this.notificationsService.selectOne({ ...conditions, ownerId: owner.id }, options);
  }

  /**
   UpdateNotificationDto
   * @param conditions 
   * @param data 
   * @param owner
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateNotificationDto,
    @User() owner: UserEntity,
  ): Promise<NotificationEntity> {
    return this.notificationsService.updateOne({ ...conditions, ownerId: owner.id }, data);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<NotificationEntity> {
    return this.notificationsService.deleteOne({ ...conditions, ownerId: owner.id });
  }
}
