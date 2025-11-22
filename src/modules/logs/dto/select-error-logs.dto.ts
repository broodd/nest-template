import { IsOptional, IsString, IsDate } from 'class-validator';
import { FindOneOptions, Brackets } from 'typeorm';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { LogErrorEntity } from '../entities';

/**
 * [description]
 */
export class SelectLogErrorsDto extends FindManyOptionsDto<LogErrorEntity> {
  /**
   * [description]
   */
  @IsString()
  @IsOptional()
  @ApiProperty()
  public _userId?: string;

  /**
   * [description]
   */
  @IsString()
  @IsOptional()
  @ApiProperty()
  public email?: string;

  /**
   * [description]
   */
  @IsString()
  @IsOptional()
  @ApiProperty()
  public method?: string;

  /**
   * [description]
   */
  @IsString()
  @IsOptional()
  @ApiProperty()
  public url?: string;

  /**
   * [description]
   */
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'Format ISO: ' + new Date().toISOString() })
  public readonly startDate?: Date;

  /**
   * [description]
   */
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'Format ISO: ' + new Date().toISOString() })
  public readonly endDate?: Date;

  /**
   * [description]
   */
  public get whereBrackets(): FindOneOptions['where'] {
    const { _userId: userId, email, method, url, startDate, endDate } = this;

    return new Brackets((qb) => {
      qb.andWhere(Object.assign({}, userId && { userId }, method && { method }));

      if (url) qb.andWhere('url ilike :url', { url: `%${url}%` });
      if (email) qb.andWhere('user.email ilike :email', { email: `%${email}%` });
      if (startDate) qb.andWhere('LogErrorEntity.createdAt >= :startDate', { startDate });
      if (endDate) qb.andWhere('LogErrorEntity.createdAt <= :endDate', { endDate });
    });
  }
}
