import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
} from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';

import { NotificationsStatusEnum, NotificationsTypeEnum } from '../enums';

@Entity('notifications')
export class NotificationEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: NotificationsStatusEnum, default: NotificationsStatusEnum.UNREAD })
  @Column({ type: 'enum', enum: NotificationsStatusEnum, default: NotificationsStatusEnum.UNREAD })
  public readonly status: NotificationsStatusEnum;

  /**
   * [description]
   */
  @ApiProperty({ enum: NotificationsTypeEnum })
  @Column({ type: 'enum', enum: NotificationsTypeEnum })
  public readonly type: NotificationsTypeEnum;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public readonly owner: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256 })
  public readonly title: string;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;
}
