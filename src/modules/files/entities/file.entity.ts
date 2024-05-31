import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/common/entities';

/**
 * [description]
 */
@Entity('files')
export class FileEntity extends CommonEntity {
  /**
   * [description]
   */
  @Expose()
  @ApiProperty({ readOnly: true })
  get src(): string {
    return `${process.env.CDN}/${this.key}`;
  }

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, readOnly: true, nullable: true })
  public readonly key: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, readOnly: true, nullable: true })
  public readonly filename: string;

  /**
   * [description]
   */
  @Column({ type: 'bigint', nullable: true })
  @ApiProperty({ readOnly: true, minimum: 1, nullable: true })
  public readonly fileSize: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, readOnly: true, nullable: true })
  public readonly mimetype: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  @ApiProperty({ maxLength: 7, readOnly: true, nullable: true })
  public readonly encoding: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, readOnly: true, nullable: true })
  public readonly extname: string;
}
