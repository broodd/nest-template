import { JoinColumn, ManyToOne, Column, Entity } from 'typeorm';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
@Entity('user_notification_tokens')
export class UserNotificationTokenEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256, nullable: false, unique: true })
  public readonly token: string;

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
  @ManyToOne(() => UserEntity, ({ notificationTokens }) => notificationTokens, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public readonly owner: Partial<UserEntity>;
}
