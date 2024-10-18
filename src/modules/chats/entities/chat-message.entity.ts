import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { JoinColumn, ManyToOne, Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/common/entities';

import { StoryEntity } from 'src/modules/posts/entities';
import { FileEntity } from 'src/modules/files/entities';
import { UserEntity } from 'src/modules/users/entities';

import { ChatEntity } from './chat.entity';

/**
 * [description]
 */
@Entity('chat_messages')
export class ChatMessageEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 5120, nullable: true })
  @Column({ type: 'varchar', length: 5120, nullable: true })
  public readonly text?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => FileEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  public readonly file?: Partial<FileEntity>;

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
  @Column({ type: 'uuid', nullable: true })
  public readonly storyId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => StoryEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly story?: Partial<StoryEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly chatId: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => ChatEntity, ({ messages }) => messages, { onDelete: 'CASCADE', nullable: false })
  public readonly chat: Partial<ChatEntity>;

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
  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly owner: Partial<UserEntity>;
}
