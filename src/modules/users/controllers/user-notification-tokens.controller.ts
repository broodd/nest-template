import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Query,
  Post,
  Body,
} from '@nestjs/common';

import { User } from 'src/common/decorators';

import { JwtAuthGuard } from 'src/modules/auth/guards';

import { UserEntity, UserNotificationTokenEntity } from '../entities';
import { UserNotificationTokensService } from '../services';
import {
  CreateUserNotificationTokenDto,
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
    await this.userNotificationTokensService.deleteOldNotificationTokens({ ownerId: owner.id });
    return this.userNotificationTokensService.createOne({ ...data, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete()
  public async deleteOneByToken(
    @Query() conditions: DeleteUserNotificationTokenDto,
    @User() owner: UserEntity,
  ): Promise<UserNotificationTokenEntity> {
    return this.userNotificationTokensService.deleteOne({ ...conditions, ownerId: owner.id });
  }
}
