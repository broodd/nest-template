import { IsArray, IsString, IsNotEmpty, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { dotNotation } from 'src/common/helpers';

import { FindOneOptionsDto } from '../find-one-options';

/**
 * [description]
 */
export class FindManyOptionsDto<Entity>
  extends FindOneOptionsDto<Entity>
  implements FindManyBracketsOptions
{
  /**
   * Order, in which entities should be ordered
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(64, { each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description: `Order, in which entities should be ordered. For order by relation field use <i>elation.field</i>`,
  })
  public asc?: string[];

  /**
   * If the same fields are specified for sorting in two directions, the priority is given to DESC
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(64, { each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public desc?: string[];

  /**
   * Getter to form an object of order. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get order(): FindManyOptions['order'] {
    return Object.assign(
      {},
      this.asc &&
        dotNotation(
          this.asc.filter((key) => !key.startsWith('__')),
          'ASC',
        ),
      this.desc &&
        dotNotation(
          this.desc.filter((key) => !key.startsWith('__')),
          'DESC',
        ),
    );
  }

  /**
   * Offset (paginated) where from entities should be taken
   */
  @Min(1)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    example: 1,
    description: 'Offset (paginated) where from entities should be taken',
  })
  public page?: number = 1;

  /**
   * Limit (paginated) - max number of entities should be taken
   */
  @Min(1)
  @Max(100)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    example: 5,
    default: 50,
    description: 'Limit (paginated) - max number of entities should be taken',
  })
  public take?: number = 50;

  /**
   * Getter to form an object of skip. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get skip(): number {
    return (this.take || 0) * (this.page - 1);
  }

  /**
   * Dto conditions
   */
  public get whereBrackets(): FindOneOptions['where'] {
    return {};
  }
}
