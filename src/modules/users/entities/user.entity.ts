import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';
import { FileEntity, FileEntityPreview } from 'src/modules/files/entities';
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserRoleEnum, UserStatusEnum } from '../enums';
import { UserRefreshTokenEntity } from './user-refresh-token.entity';

/**
 * [description]
 */
@Entity('users')
export class UserEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  public readonly status: UserStatusEnum;

  /**
   * [description]
   */
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  public readonly role: UserRoleEnum;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 320, uniqueItems: true })
  @Column({ type: 'varchar', length: 320, unique: true })
  public readonly email: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 64, select: false })
  public password: string;

  /**
   * [description]
   */
  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 8);
  }

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: () => FileEntityPreview })
  @Transform(({ value }) => value && new FileEntityPreview(value))
  @ManyToOne(() => FileEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    // cascade: true, // Turned off cause have 'Cyclic dependency' on FileEntity {owner}; Choose one of these
    eager: true,
  })
  public readonly cover: Partial<FileEntity> = new FileEntity();

  /**
   * [description]
   */
  @ApiHideProperty()
  @OneToMany(() => UserRefreshTokenEntity, ({ user }) => user, {
    nullable: true,
  })
  public readonly refreshTokens: UserRefreshTokenEntity[];

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @DeleteDateColumn()
  public readonly deletedAt: Date;
}
