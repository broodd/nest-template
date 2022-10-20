import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MultipartFile } from '@fastify/multipart';
import {
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { User, UseRole } from 'src/common/decorators';
import { File } from 'src/multipart/decorators';
import { ID } from 'src/common/dto';

import { JwtAuthGuard } from '../auth/guards';

import { FileEntity } from './entities';
import { SelectFileDto, CreateFileDto, SelectFilesDto, PaginationFilesDto } from './dto';

import { UserEntity } from '../users/entities';
import { FilesService } from './files.service';
import { UserRoleEnum } from '../users/enums';

/**
 * [description]
 */
@ApiTags('files')
@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  /**
   * [description]
   * @param filesService
   */
  constructor(private readonly filesService: FilesService) {}

  /**
   * [description]
   * @param file
   * @param owner
   */
  @Post('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateFileDto })
  @ApiConsumes('multipart/form-data')
  public async createOne(
    @File() file: MultipartFile,
    @User() owner: UserEntity,
  ): Promise<FileEntity> {
    return this.filesService.createOne(file, { owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseRole(UserRoleEnum.ADMIN)
  public async selectAll(@Query() options: SelectFilesDto): Promise<PaginationFilesDto> {
    return this.filesService.selectAll(options);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   * @param options
   */
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseRole(UserRoleEnum.ADMIN)
  public async selectOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
    @Query() options: SelectFileDto,
  ): Promise<FileEntity> {
    return this.filesService.selectOne({ ...conditions, owner: { id: owner.id } }, options);
  }

  /**
   * [description]
   * @param file
   * @param conditions
   * @param owner
   */
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateFileDto })
  @ApiConsumes('multipart/form-data')
  public async updateOne(
    @File() file: MultipartFile,
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<FileEntity> {
    return this.filesService.updateOne(file, { ...conditions, owner: { id: owner.id } });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseRole(UserRoleEnum.ADMIN)
  public async deleteOne(@Param() conditions: ID, @User() owner: UserEntity): Promise<FileEntity> {
    return this.filesService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
