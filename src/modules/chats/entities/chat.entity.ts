import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Entity,
} from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';

import { ChatParticipantEntity } from './chat-participant.entity';
import { ChatMessageEntity } from './chat-message.entity';

/**
 * [description]
 */
@Entity('chats')
export class ChatEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  @OneToMany(() => ChatParticipantEntity, (participant) => participant.chat, {
    cascade: true,
  })
  public readonly participants: Partial<ChatParticipantEntity>[];

  /**
   * [description]
   */
  @ApiHideProperty()
  @ManyToOne(() => ChatMessageEntity, { onDelete: 'SET NULL', nullable: true })
  public readonly lastMessage: Partial<ChatMessageEntity>;

  /**
   * [description]
   */
  @ApiHideProperty()
  @OneToMany(() => ChatMessageEntity, ({ chat }) => chat)
  public readonly messages: Partial<ChatMessageEntity>[];

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

  /**
   * [description]
   */
  @ApiHideProperty()
  @Transform(({ value }) => value && value.user)
  public readonly participant: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  public newMessagesCount?: number;
}
