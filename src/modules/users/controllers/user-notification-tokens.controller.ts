import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Patch,
  Query,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from 'src/modules/auth/guards';

import { UserNotificationTokensService } from '../services';
import { UserEntity, UserNotificationTokenEntity } from '../entities';
import {
  PaginationUserNotificationTokensDto,
  SelectUserNotificationTokensDto,
  CreateUserNotificationTokenDto,
  SelectUserNotificationTokenDto,
  UpdateUserNotificationTokenDto,
  DeleteUserNotificationTokenDto,
} from '../dto/user-notification-tokens';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users/notification-tokens')
@Controller('users/notification-tokens')
@UseInterceptors(ClassSerializerInterceptor)
export class UserNotificationTokensController {
  /**
   * [description]
   * @param userNotificationTokensService
   */
  constructor(private readonly userNotificationTokensService: UserNotificationTokensService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  public async createOne(
    @Body() data: CreateUserNotificationTokenDto,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.createOne({ ...data, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectUserNotificationTokensDto,
  ): Promise<PaginationUserNotificationTokensDto> {
    return this.userNotificationTokensService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get(':id')
  public async selectOne(
    @Param() conditions: ID,
    @Query() options: SelectUserNotificationTokenDto,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.selectOne(
      { ...conditions, owner: { id: owner.id } },
      options,
    );
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateUserNotificationTokenDto,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.updateOne(
      { ...conditions, owner: { id: owner.id } },
      data,
    );
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete('')
  public async deleteOneByToken(
    @Query() conditions: DeleteUserNotificationTokenDto,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
