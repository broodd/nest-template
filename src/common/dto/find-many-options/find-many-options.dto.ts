import { IsArray, IsString, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';

import { FindOneOptionsDto } from '../find-one-options';
import { dotNotation } from 'src/common/helpers';
import { FindManyBracketsOptions } from 'src/common/interfaces/find-many-brackets.interface';

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
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description: `Order, in which entities should be ordered. For order by relation field use <i>elation.field</i>`,
  })
  public readonly asc?: string[];

  /**
   * If the same fields are specified for sorting in two directions, the priority is given to DESC
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public readonly desc?: string[];

  /**
   * Getter to form an object of order. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get order(): FindManyOptions['order'] {
    return Object.assign(
      {},
      this.asc && dotNotation(this.asc, 'ASC'),
      this.desc && dotNotation(this.desc, 'DESC'),
    );
  }

  /**
   * Offset (paginated) where from entities should be taken
   */
  @IsOptional()
  @Min(1)
  @ApiProperty({
    type: String,
    example: 1,
    description: 'Offset (paginated) where from entities should be taken',
  })
  public readonly page?: number = 1;

  /**
   * Limit (paginated) - max number of entities should be taken
   */
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiProperty({
    type: String,
    example: 5,
    default: 50,
    description: 'Limit (paginated) - max number of entities should be taken',
  })
  public readonly take?: number = 50;

  /**
   * Getter to form an object of skip. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get skip(): number {
    return this.take * (this.page - 1);
  }
}
