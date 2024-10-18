import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Param,
  Query,
  Post,
  Get,
  Body,
  Patch,
} from '@nestjs/common';

import { ID } from 'src/common/dto';

import { JwtAuthGuard } from '../../auth/guards';

import { GroupsService } from '../services';
import { GroupEntity } from '../entities';
import {
  PaginationGroupsDto,
  SelectGroupsDto,
  CreateGroupDto,
  SelectGroupDto,
  UpdateGroupDto,
} from '../dto';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class GroupsController {
  /**
   * [description]
   * @param groupsService
   */
  constructor(private readonly groupsService: GroupsService) {}

  /**
   * [description]
   * @param data
   * @param owner
   */
  @Post()
  public async createOne(@Body() data: CreateGroupDto): Promise<GroupEntity> {
    return this.groupsService.createOne(data);
  }

  /**
   * [description]
   * @param options
   * @param owner
   */
  @Get()
  public async selectManyAndCount(@Query() options: SelectGroupsDto): Promise<PaginationGroupsDto> {
    return this.groupsService.selectManyAndCount(options);
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
    @Query() options: SelectGroupDto,
  ): Promise<GroupEntity> {
    return this.groupsService.selectOne(conditions, options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   * @param owner
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateGroupDto,
  ): Promise<GroupEntity> {
    return this.groupsService.updateOne(conditions, data);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID): Promise<GroupEntity> {
    return this.groupsService.deleteOne(conditions);
  }
}
