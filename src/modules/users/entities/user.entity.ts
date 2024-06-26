import { FileEntity } from 'src/modules/files/entities';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { hash } from 'src/common/helpers';
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { UserNotificationTokenEntity } from './user-notification-token.entity';
import { UserRefreshTokenEntity } from './user-refresh-token.entity';
import { UserRoleEnum, UserStatusEnum } from '../enums';
import { CommonEntity } from 'src/common/entities';

/**
 * [description]
 */
@Entity('users')
export class UserEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  public readonly status: UserStatusEnum;

  /**
   * [description]
   */
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  public readonly role: UserRoleEnum;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 128 })
  @Column({ type: 'varchar', length: 128, nullable: true })
  public readonly name: string;

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
  @Column({ type: 'varchar', length: 149, select: false })
  public password: string;

  /**
   * [description]
   */
  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (!this.password) return;
    this.password = await hash(this.password);
  }

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: () => FileEntity })
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
  @OneToMany(() => UserRefreshTokenEntity, ({ owner }) => owner)
  public readonly refreshTokens: UserRefreshTokenEntity[];

  /**
   * [description]
   */
  @ApiHideProperty()
  @OneToMany(() => UserNotificationTokenEntity, ({ owner }) => owner)
  public readonly notificationTokens: UserNotificationTokenEntity[];
}
