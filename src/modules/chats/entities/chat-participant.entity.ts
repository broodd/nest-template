import { JoinColumn, ManyToOne, Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';
import { ChatEntity } from './chat.entity';

/**
 * [description]
 */
@Entity('chat_participants')
@Index('chat_participants__chat_user', ['chat', 'user'], { unique: true })
export class ChatParticipantEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly userId: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly user: Partial<UserEntity>;

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
  @ApiProperty()
  @ManyToOne(() => ChatEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly chat: Partial<ChatEntity>;
}
