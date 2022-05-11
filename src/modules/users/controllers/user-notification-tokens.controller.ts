import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from 'src/modules/auth/guards';

import { UserNotificationTokensService } from '../services';
import { UserEntity, UserNotificationTokenEntity } from '../entities';
import {
  SelectUsersDto,
  PaginationUsersDto,
  CreateUserNotificationTokenDto,
  SelectUserNotificationTokenDto,
  UpdateUserNotificationTokenDto,
  DeleteUserNotificationTokenDto,
} from '../dto';

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
  public async selectAll(@Query() options: SelectUsersDto): Promise<PaginationUsersDto> {
    return this.userNotificationTokensService.selectAll(options);
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
