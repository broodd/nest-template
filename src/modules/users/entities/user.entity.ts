import {
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Column,
  Entity,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';
import { hash } from 'src/common/helpers';

import { VirtualColumn } from 'src/database/decorators';

import { NotificationEntity } from 'src/modules/notifications/entities';
import { RelationshipEntity } from 'src/modules/relationships/entities';
import { StoryEntity, PostEntity } from 'src/modules/posts/entities';
import { GroupSubscriberEntity } from 'src/modules/groups/entities';
import { FileEntity } from 'src/modules/files/entities';

import { UserStatusEnum, UserRoleEnum } from '../enums';

import { UserNotificationTokenEntity } from './user-notification-token.entity';
import { UserRefreshTokenEntity } from './user-refresh-token.entity';

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
  @ApiProperty({ maxLength: 64 })
  @Column({ type: 'varchar', length: 64, default: 'Europe/London' })
  public readonly timezone: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 128 })
  @Column({ type: 'varchar', length: 128, nullable: true })
  public readonly name?: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 5120 })
  @Column({ type: 'varchar', length: 5120, nullable: true })
  public readonly description?: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 50, uniqueItems: true })
  @Column({ type: 'varchar', length: 50, unique: true })
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
    cascade: true,
    eager: true,
  })
  public readonly cover: Partial<FileEntity>;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: () => FileEntity })
  @ManyToOne(() => FileEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: true,
  })
  public readonly backgroudCover: Partial<FileEntity>;

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

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => NotificationEntity, ({ owner }) => owner)
  public readonly notifications: NotificationEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => RelationshipEntity, ({ owner }) => owner)
  public readonly followings: RelationshipEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => RelationshipEntity, ({ target }) => target)
  public readonly followers: RelationshipEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => GroupSubscriberEntity, ({ user }) => user)
  public readonly groups: GroupSubscriberEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => PostEntity, ({ owner }) => owner)
  public readonly posts: PostEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => StoryEntity, ({ owner }) => owner)
  public readonly stories: StoryEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __posts_count?: string;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __followers_count?: string;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __followings_count?: string;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  @Transform(({ value }) => (value !== undefined ? !!value : undefined))
  public readonly __is_followings?: boolean;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  @Transform(({ value }) => (value !== undefined ? !!value : undefined))
  public readonly __is_viewed_stories?: boolean;
}
