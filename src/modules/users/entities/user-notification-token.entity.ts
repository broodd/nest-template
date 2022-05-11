import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'src/modules/users/entities';

@Entity('user_notification_tokens')
export class UserNotificationTokenEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256 })
  @Column({ type: 'varchar', length: 256, nullable: false, unique: true })
  public readonly token: string;

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
}
