import { JoinColumn, ManyToOne, Entity, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';
import { StoryEntity } from './story.entity';

/**
 * [description]
 */
@Entity('story_views')
@Index('story_views__story_user', ['story', 'user'], { unique: true })
export class StoryViewEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly storyId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => StoryEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    cascade: false,
  })
  public readonly story: Partial<StoryEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly userId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    cascade: false,
  })
  public readonly user: Partial<UserEntity>;
}
