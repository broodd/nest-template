import { Column, Entity, ManyToOne, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';
import { FileEntity } from 'src/modules/files/entities';

import { StoryViewEntity } from './story-view.entity';

/**
 * [description]
 */
@Entity('stories')
export class StoryEntity extends CommonEntity {
  /**
   * [description]
   */
  @JoinTable()
  @ApiProperty({ type: () => FileEntity })
  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE', nullable: true })
  public readonly image?: Partial<FileEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly ownerId?: string;

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
  public readonly owner: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => StoryViewEntity, ({ story }) => story)
  public readonly views: StoryViewEntity[];

  /**
   * [description]
   */
  @ApiProperty()
  public readonly viewed?: StoryViewEntity;
}
