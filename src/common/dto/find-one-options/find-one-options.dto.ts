import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { Transform, Exclude, Expose } from 'class-transformer';
import { FindOptionsSelect } from 'typeorm';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { stringArrayToNestedObject } from 'src/common/helpers/transform.helper';
import { FindOneBracketsOptions } from 'src/common/interfaces';

import { CustomExtendedOptionsDto } from '../custom-extended-options';

/**
 * Only letters, numbers, dot, underscore
 */
// const JOIN_RELATIONS_REGEX = /^[a-zA-Z0-9._]+$/;

/**
 * [description]
 */
export class FindOneOptionsDto<Entity>
  extends CustomExtendedOptionsDto
  implements FindOneBracketsOptions
{
  /**
   * Specifies what columns should be retrieved
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    example: [],
    description: 'Specifies what columns should be retrieved',
  })
  public selection?: string[];

  /**
   * Expose field `select`, specifies what columns should be retrieved
   */
  @Expose({ toPlainOnly: true })
  public get select(): FindOptionsSelect<Entity> {
    return Object.assign(
      {},
      this.selection && stringArrayToNestedObject(this.selection as string[], true),
    );
  }

  /**
   * Indicates what relations of entity should be loaded (simplified left join form)
   */
  @ApiHideProperty()
  public eager?: boolean;

  /**
   * Getter to form an property of loadEagerRelations. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get loadEagerRelations(): boolean {
    return this.eager !== undefined ? !!this.eager : true;
  }

  /**
   * Specifies what columns should be retrieved
   * Works when eager is true
   */
  @ApiHideProperty()
  public joinRelations?: string[];

  /**
   * Specifies what columns should NOT be retrieved
   * Works when eager is true
   */
  @ApiHideProperty()
  public excludeRelations?: string[];
}
