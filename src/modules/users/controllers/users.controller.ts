import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  StreamableFile,
  Controller,
  UseGuards,
  Delete,
  Param,
  Patch,
  Query,
  Post,
  Body,
  Get,
  Header,
} from '@nestjs/common';

import { User, UseRole } from 'src/common/decorators';
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
  @UseRole(UserRoleEnum.ADMIN)
  public async createOne(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createOne(data);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectUsersDto,
    @User() user: UserEntity,
  ): Promise<PaginationUsersDto> {
    options.userId = user.id;
    return this.usersService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param options
   */
  @Get('export/csv')
  @Header('Content-Disposition', 'attachment; filename=users.csv')
  public async selectAllAsCSV(@Query() options: SelectUsersDto): Promise<StreamableFile> {
    options.take = undefined;
    const readable = await this.usersService.exportManyAsCSV(options);
    return new StreamableFile(readable);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get(':id')
  public async selectOneWithCounters(
    @Param() conditions: ID,
    @Query() options: SelectUserDto,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    options.userId = user.id;
    return this.usersService.selectOneWithCounters(conditions, options);
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
    return this.usersService.updateOne(conditions, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  @UseRole(UserRoleEnum.ADMIN)
  public async deleteOne(@Param() conditions: ID): Promise<UserEntity> {
    return this.usersService.deleteOne(conditions);
  }
}
