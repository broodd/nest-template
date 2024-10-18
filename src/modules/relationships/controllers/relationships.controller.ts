import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ConflictException,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Query,
  Post,
  Get,
  Body,
} from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';
import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { ChatsService } from 'src/modules/chats/services';
import { UserEntity } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards';

import { CreateRelationshipDto, PaginationRelationshipsDto, SelectRelationshipsDto } from '../dto';
import { RelationshipsService } from '../services';
import { RelationshipEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('relationships')
@Controller('relationships')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class RelationshipsController {
  /**
   * [description]
   * @param relationshipsService
   * @param chatsService
   */
  constructor(
    private readonly relationshipsService: RelationshipsService,
    private readonly chatsService: ChatsService,
  ) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post('followings/users/:id')
  public async createOne(
    @Param() conditions: ID,
    @Body() data: CreateRelationshipDto,
    @User() owner: UserEntity,
  ): Promise<RelationshipEntity> {
    if (conditions.id === owner.id)
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR });

    if (!data.isBlocked) {
      let chat = await this.chatsService.selectOneByParticipants([conditions.id, owner.id]);
      if (!chat)
        chat = await this.chatsService.createOne({
          participants: [{ user: { id: owner.id } }, { user: { id: conditions.id } }],
        });
    }

    const entity = await this.relationshipsService
      .selectOne({ targetId: conditions.id, ownerId: owner.id })
      .catch(() => null);

    return this.relationshipsService.createOne({
      id: entity?.id,
      ...data,
      target: conditions,
      owner: { id: owner.id },
    });
  }

  /**
   * [description]
   * @param options
   * @param owner
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectRelationshipsDto,
    @User() owner: UserEntity,
  ): Promise<PaginationRelationshipsDto> {
    options.ownerId = owner.id;
    return this.relationshipsService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get('owners/:id')
  public async selectManyAndCountByOwner(
    @Param() conditions: ID,
    @Query() options: SelectRelationshipsDto,
  ): Promise<PaginationRelationshipsDto> {
    options.ownerId = conditions.id;
    return this.relationshipsService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete('followings/users/:id')
  public async deleteOneFollowings(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<RelationshipEntity> {
    return this.relationshipsService.deleteOne({ targetId: conditions.id, ownerId: owner.id });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete('followers/users/:id')
  public async deleteOneFollower(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<RelationshipEntity> {
    return this.relationshipsService.deleteOne({
      targetId: owner.id,
      ownerId: conditions.id,
      isBlocked: false,
    });
  }
}
