import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { JoinColumn, ManyToOne, Entity, Column } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';

import { NotificationsStatusEnum, NotificationsTypeEnum } from '../enums';
import { CommonEntity } from 'src/common/entities';

/**
 * [description]
 */
@Entity('notifications')
export class NotificationEntity extends CommonEntity {
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
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256 })
  public readonly title: string;

  /*
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
