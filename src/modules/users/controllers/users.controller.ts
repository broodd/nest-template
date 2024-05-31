import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Headers,
  Delete,
  Param,
  Patch,
  Query,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { UseRole } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from 'src/modules/auth/guards';

import { UsersService } from '../services';
import { UserEntity } from '../entities';
import { UserRoleEnum } from '../enums';
import {
  PaginationUsersDto,
  SelectUsersDto,
  SelectUserDto,
  UpdateUserDto,
  CreateUserDto,
} from '../dto';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  /**
   * [description]
   * @param usersService
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  @UseRole(UserRoleEnum.SUPER_ADMIN)
  public async createOne(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createOne(data);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  @UseRole(UserRoleEnum.SUPER_ADMIN)
  public async selectManyAndCount(@Query() options: SelectUsersDto): Promise<PaginationUsersDto> {
    return this.usersService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get(':id')
  public async selectOne(
    @Param() conditions: ID,
    @Query() options: SelectUserDto,
  ): Promise<UserEntity> {
    return this.usersService.selectOne(conditions, options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  @UseRole(UserRoleEnum.SUPER_ADMIN)
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateOne(conditions, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  @UseRole(UserRoleEnum.SUPER_ADMIN)
  public async deleteOne(@Param() conditions: ID): Promise<UserEntity> {
    return this.usersService.deleteOne(conditions);
  }
}
