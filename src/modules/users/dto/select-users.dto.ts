import { IsOptional, MaxLength, MinLength, IsEnum, IsUUID } from 'class-validator';
import { FindOneOptions, Brackets, ILike, In } from 'typeorm';
import { Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { UserStatusEnum, UserRoleEnum } from '../enums';
import { UserEntity } from '../entities';

/**
 * [description]
 */
export class SelectUsersDto extends FindManyOptionsDto<UserEntity> {
  /**
   * [description]
   */
  @IsOptional()
  @ApiProperty()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => [].concat(value))
  public ids?: string[];

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @ApiProperty()
  @MaxLength(256)
  public readonly search?: string;

  /**
   * [description]
   */
  @IsOptional()
  @ApiProperty({ enum: UserRoleEnum })
  @IsEnum(UserRoleEnum, { each: true })
  @Transform(({ value }) => [].concat(value))
  public readonly roles?: UserRoleEnum[];

  /**
   * [description]
   */
  @IsOptional()
  @ApiProperty({ enum: UserStatusEnum })
  @IsEnum(UserStatusEnum, { each: true })
  @Transform(({ value }) => [].concat(value))
  public statuses?: UserStatusEnum[];

  /**
   * [description]
   */
  public get whereBrackets(): FindOneOptions['where'] {
    const { ids, search, roles, statuses } = this;

    return new Brackets((qb) => {
      qb.where(
        Object.assign(
          {},
          ids && { id: In(ids) },
          roles?.length && { role: In(roles) },
          statuses?.length && { status: In(statuses) },
        ),
      );

      if (search) {
        const like = ILike(`%${search.trim()}%`);
        qb.andWhere({ name: like });
      }
    });
  }
}
