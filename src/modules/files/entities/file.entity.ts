import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { MultipartFile } from '@fastify/multipart';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
@Entity('files')
export class FileEntity implements Partial<MultipartFile> {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @Expose({ toClassOnly: true })
  @ApiProperty({ readOnly: true })
  get src(): string {
    /**
     * @example for s3
     */
    return `${process.env.CDN}/${this.filename}${this.extname}`;

    /**
     * @example for disk storage
     */
    /* 
      if (!this.fileSize) return null;
      const url = new URL(join(process.env.CDN, this.title));
      url.searchParams.set('id', this.id);
      return url.toString();
    */
  }

  /**
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  public readonly owner: Partial<UserEntity>;

  /**
   * [description]
   */
  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({ maxLength: 256, readOnly: true, nullable: true })
  public readonly title: string;

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

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly updatedAt: Date;
}

/**
 * [description]
 */
export class FileEntityPreview extends PickType(FileEntity, ['id', 'src']) {
  /**
   * [description]
   * @param id
   * @param src
   * @param fileSize
   */
  constructor({ id, src }: Partial<FileEntity>) {
    super();
    Object.assign(this, { id, src });
  }
}
