import { Transform } from 'class-transformer';
import { OneToMany, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { VirtualColumn } from 'src/database/decorators';

import { UserEntity } from 'src/modules/users/entities';

import { ChatParticipantEntity } from './chat-participant.entity';
import { ChatMessageEntity } from './chat-message.entity';

/**
 * [description]
 */
@Entity('chats')
export class ChatEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => ChatMessageEntity, ({ chat }) => chat)
  public readonly messages: Partial<ChatMessageEntity>[];

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => ChatParticipantEntity, ({ chat }) => chat, { cascade: true })
  public readonly participants: Partial<ChatParticipantEntity>[];

  /**
   * [description]
   */
  @ApiProperty()
  @Transform(({ value }) => value && value.user)
  public readonly participant: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly lastMessage?: Partial<ChatMessageEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __new_messages_count?: string;
}
