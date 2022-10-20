import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';

import { FileEntity } from 'src/modules/files/entities/file.entity';
import { UserEntity } from 'src/modules/users/entities';

import { ChatMessageStatusEnum, ChatMessageTypeEnum } from '../enums';
import { ChatEntity } from './chat.entity';

/**
 * [description]
 */
@Entity('chat_messages')
export class ChatMessageEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: ChatMessageTypeEnum, default: ChatMessageTypeEnum.TEXT })
  @Column({ type: 'enum', enum: ChatMessageTypeEnum, default: ChatMessageTypeEnum.TEXT })
  public readonly type: ChatMessageTypeEnum;

  /**
   * [description]
   */

  @ApiProperty({ enum: ChatMessageStatusEnum, default: ChatMessageStatusEnum.SENT })
  @Column({ type: 'enum', enum: ChatMessageStatusEnum, default: ChatMessageStatusEnum.SENT })
  public readonly status: ChatMessageStatusEnum;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 6e4, nullable: true })
  @Column({ type: 'varchar', length: 6e4, nullable: true })
  public readonly text: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: String, example: 'URL' })
  @ManyToOne(() => FileEntity, {
    onDelete: 'CASCADE',
    nullable: true,
    cascade: true,
    eager: true,
  })
  public readonly file: Partial<FileEntity>;

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
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => ChatMessageEntity, { onDelete: 'CASCADE', nullable: true })
  public readonly reply: Partial<ChatMessageEntity>;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly owner: Partial<UserEntity>;

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
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;
}
