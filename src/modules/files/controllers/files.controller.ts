import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Patch,
  Query,
  Body,
  Post,
  Get,
} from '@nestjs/common';
import { ApiCookieAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UseRole, User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { StorageFoldersEnum } from 'src/multipart';

import { UserEntity } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { UserRoleEnum } from 'src/modules/users/enums';

import { PaginationFilesDto, SelectFilesDto, CreateFileDto, SelectFileDto } from '../dto';
import { FilesService } from '../services';
import { FileEntity } from '../entities';

/**
 * [description]
 */
@ApiCookieAuth('accessToken')
@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@UseRole(UserRoleEnum.ADMIN)
export class FilesController {
  /**
   * [description]
   * @param filesService
   */
  constructor(private readonly filesService: FilesService) {}

  /**
   * [description]
   * @param file
   */
  @Post()
  @ApiConsumes('multipart/form-data')
  public async createOne(
    @Body() data: CreateFileDto,
    @User() user: UserEntity,
  ): Promise<FileEntity> {
    return this.filesService.createOne(data.file, user.id, StorageFoldersEnum.FILES);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectManyAndCount(@Query() options: SelectFilesDto): Promise<PaginationFilesDto> {
    return this.filesService.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  @Get(':id')
  public async selectOne(
    @Param() conditions: ID,
    @Query() options: SelectFileDto,
  ): Promise<FileEntity> {
    return this.filesService.selectOne(conditions, options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: CreateFileDto,
  ): Promise<FileEntity> {
    return this.filesService.updateOne(conditions, data.file);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID): Promise<FileEntity> {
    return this.filesService.deleteOne(conditions);
  }
}
