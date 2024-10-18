import { IsEnum, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Brackets, FindOneOptions, ILike, In } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { FindManyOptionsDto } from 'src/common/dto';

import { UserRoleEnum, UserStatusEnum } from '../enums';
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
