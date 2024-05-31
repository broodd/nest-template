import { IsEnum, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Brackets, FindOneOptions, ILike } from 'typeorm';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { UserEntity } from '../entities';

/**
 * [description]
 */
export class SelectUsersDto extends FindManyOptionsDto<UserEntity> {

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
  public get whereBrackets(): FindOneOptions['where'] {
    const {  search } =
      this;

    return new Brackets((qb) => {

      if (search) {
        const like = ILike(`%${search.trim()}%`);
        qb.andWhere([{ name: like }, { surname: like }, { email: like }]);
      }
    });
  }
}
