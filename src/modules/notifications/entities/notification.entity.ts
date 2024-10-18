import { JoinColumn, ManyToOne, Entity, Column } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';

import { NotificationsTypeEnum } from '../enums';

/**
 * [description]
 */
@Entity('notifications')
export class NotificationEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256 })
  public readonly title: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256, nullable: true })
  public readonly body?: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: NotificationsTypeEnum })
  @Column({ type: 'enum', enum: NotificationsTypeEnum })
  public readonly type: NotificationsTypeEnum;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  public readonly readAt?: Date;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly ownerId: string;

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
}
