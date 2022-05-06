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

import { UseRole } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from '../auth/guards';

import { UsersService } from './services';
import { UserEntity } from './entities';
import { UserRoleEnum } from './enums';
import {
  PaginationUsersDto,
  SelectUsersDto,
  CreateUserDto,
  SelectUserDto,
  UpdateUserDto,
} from './dto';

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
   * @param userService
   */
  constructor(private readonly userService: UsersService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  @UseRole(UserRoleEnum.ADMIN)
  public async createOne(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.userService.createOne(data);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  @UseRole(UserRoleEnum.ADMIN)
  public async selectAll(@Query() options: SelectUsersDto): Promise<PaginationUsersDto> {
    return this.userService.selectAll(options);
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
    return this.userService.selectOne(conditions, options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  @UseRole(UserRoleEnum.ADMIN)
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateOne(conditions, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  @UseRole(UserRoleEnum.ADMIN)
  public async deleteOne(@Param() conditions: ID): Promise<UserEntity> {
    return this.userService.deleteOne(conditions);
  }
}
