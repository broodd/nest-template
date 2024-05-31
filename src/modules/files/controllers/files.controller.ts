import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Delete,
  Patch,
  Param,
  Query,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { FileValidationPipe } from 'src/multipart/pipes';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { ID } from 'src/common/dto';

import { SelectFileDto, CreateFileDto, SelectFilesDto, PaginationFilesDto } from '../dto';
import { FilesService } from '../services';
import { FileEntity } from '../entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
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
  @ApiConsumes('multipart/form-data')
  public async createOne(@Body(FileValidationPipe) data: CreateFileDto): Promise<FileEntity> {
    return this.filesService.createOne(data.file);
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
   * @param owner
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
   * @param file
   * @param conditions
   * @param owner
   */
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  public async updateOne(
    @Body() data: CreateFileDto,
    @Param() conditions: ID,
  ): Promise<FileEntity> {
    return this.filesService.updateOne(conditions, data.file);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID): Promise<FileEntity> {
    return this.filesService.deleteOne(conditions);
  }
}
