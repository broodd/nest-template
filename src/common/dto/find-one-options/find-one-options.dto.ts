import { IsArray, IsString, IsNotEmpty, IsOptional, IsBooleanString } from 'class-validator';
import { dotNotation } from 'src/common/helpers/transform.helper';
import { Exclude, Expose, Transform } from 'class-transformer';
import { FindOneOptions, FindOptionsSelect } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class FindOneOptionsDto<Entity> implements FindOneOptions {
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
  public readonly selection?: (keyof Entity)[];

  /**
   * Expose field `select`, specifies what columns should be retrieved
   */
  @Expose({ toPlainOnly: true })
  public get select(): FindOptionsSelect<Entity> {
    return Object.assign({}, this.selection && dotNotation(this.selection as string[], true));
  }

  /**
   * Indicates what relations of entity should be loaded (simplified left join form)
   */
  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates what relations of entity should be loaded',
  })
  public eager?: string;

  /**
   * Getter to form an property of loadEagerRelations. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get loadEagerRelations(): boolean {
    return !!this.eager ? JSON.parse(this.eager) : true;
  }
}
