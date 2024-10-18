import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { UserEntity } from '../../users/entities';
import { JwtAuthGuard } from '../../auth/guards';

import { GroupSubscribersService } from '../services';
import { GroupSubscriberEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('group-subscribers')
@Controller('group-subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupSubscribersController {
  /**
   * [description]
   * @param groupSubscribersService
   */
  constructor(private readonly groupSubscribersService: GroupSubscribersService) {}

  /**
   * [description]
   * @param conditions
   * @param user
   */
  @Post('groups/:id')
  public async createOne(
    @Param() conditions: ID,
    @User() user: UserEntity,
  ): Promise<GroupSubscriberEntity> {
    return this.groupSubscribersService.createOne({
      group: { id: conditions.id },
      user: { id: user.id },
    });
  }

  /**
   * [description]
   * @param conditions
   * @param user
   */
  @Delete('groups/:id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() user: UserEntity,
  ): Promise<GroupSubscriberEntity> {
    return this.groupSubscribersService.deleteOne({
      groupId: conditions.id,
      userId: user.id,
    });
  }
}
