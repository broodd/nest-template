import { JoinColumn, ManyToOne, Entity, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';
import { PostEntity } from './post.entity';

/**
 * [description]
 */
@Entity('post_likes')
@Index('post_likes__post_owner', ['post', 'owner'], { unique: true })
export class PostLikeEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly postId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => PostEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    cascade: false,
  })
  public readonly post: Partial<PostEntity>;

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
}
