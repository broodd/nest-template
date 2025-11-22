import path from 'node:path';

import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { ConfigService } from 'src/config';

const config = new ConfigService();
const privateKey = config.get<string>('CLOUD_FRONT_PRIVATE_KEY').replace(/\\n/g, '\n');
const keyPairId = config.get<string>('CLOUD_FRONT_PAIR_ID_KEY');

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
    const dateLessThan = new Date();
    dateLessThan.setDate(dateLessThan.getDate() + 1);

    return this.key
      ? getSignedUrl({
          url: new URL(path.join(process.env.CDN, this.key)).toString(),
          dateLessThan: dateLessThan.toString(),
          privateKey,
          keyPairId,
        })
      : null;
  }

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, nullable: true })
  public readonly key: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, nullable: true })
  public readonly filename: string;

  /**
   * [description]
   */
  @Column({ type: 'bigint', nullable: true })
  @ApiProperty({ minimum: 1, nullable: true })
  public readonly fileSize: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, nullable: true })
  public readonly mimetype: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  @ApiProperty({ maxLength: 7, nullable: true })
  public readonly encoding: string;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, nullable: true })
  public readonly extname: string;
}
