import { ArrayMaxSize, ArrayMinSize, Equals, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Point } from 'geojson';

/**
 * [description]
 */
export class CreateLocationDto implements Point {
  /**
   * [description]
   * @param coordinates
   */
  constructor(coordinates: [number, number]) {
    this.coordinates = coordinates;
  }

  /**
   * [description]
   */
  @IsOptional()
  @ApiProperty()
  @Equals('Point')
  public readonly type = 'Point';

  /**
   * [description]
   */
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Number)
  @IsNumber(undefined, { each: true })
  @ApiProperty({
    description: 'format (longitude, latitude)',
    externalDocs: {
      description: 'format (longitude, latitude)',
      url: 'https://www.postgis.net/workshops/postgis-intro/geography.html#using-geography',
    },
    example: [2.5559, 49.0083],
  })
  public readonly coordinates: [number, number];
}
