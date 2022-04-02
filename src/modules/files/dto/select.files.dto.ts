import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { FindOneOptions, ILike } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { FindManyOptionsDto } from 'src/common/dto';

import { FileEntity } from '../entities';

/**
 * [description]
 */
export class SelectFilesDto extends FindManyOptionsDto<FileEntity> {
  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty({ example: 'example.md' })
  public readonly title?: string;

  /**
   * [description]
   */
  public get where(): FindOneOptions<FileEntity>['where'] {
    const { title } = this;
    return Object.assign(
      {},
      title && {
        title: ILike(`%${title}%`),
      },
    );
  }

  /**
   * [description]
   */
  /* public get whereBrackets(): Brackets {
    const { title } = this;
    return new Brackets((qb) => {
      if (title) qb.andWhere({ title: ILike(`%${title}%`) });
    });
  } */
}
