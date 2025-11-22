import { Controller, Delete, Param, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaginationDto, ID } from 'src/common/dto';

import { LogErrorsService } from '../services';
import { LogErrorEntity } from '../entities';
import { SelectLogErrorsDto } from '../dto';

/**
 * Routes secured by basic auth (configured in ./swagger.ts)
 */
@ApiTags('logs/errors')
@Controller('logs/errors')
export class LogErrorsController {
  /**
   * [description]
   * @param service
   */
  constructor(private readonly service: LogErrorsService) {}

  /**
   * [description]
   * @param options
   * @param owner
   */
  @Get()
  public async selectManyAndCount(
    @Query() options: SelectLogErrorsDto,
  ): Promise<PaginationDto<LogErrorEntity>> {
    options.joinRelations ??= [];
    options.joinRelations = options.joinRelations.concat(['user']);
    return this.service.selectManyAndCount(options);
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   */
  @Delete(':id')
  public async deleteOne(@Param() conditions: ID): Promise<number> {
    return this.service.delete(conditions);
  }
}
