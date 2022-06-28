import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
  Index,
} from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';
import { ChatEntity } from './chat.entity';

/**
 * [description]
 */
@Entity('chat_participants')
@Index('unique_chat_participants', ['user', 'chat'], { unique: true })
export class ChatParticipantEntity {
  /*
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /*
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly userId: string;

  /*
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly user: Partial<UserEntity>;

  /*
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly chatId: string;

  /*
   * [description]
   */
  @JoinColumn()
  @ApiHideProperty()
  @ManyToOne(() => ChatEntity, { onDelete: 'CASCADE', nullable: false })
  public readonly chat: Partial<ChatEntity>;

  /*
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  /*
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;
}
