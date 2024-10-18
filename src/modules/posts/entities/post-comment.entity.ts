import { ManyToOne, Column, Entity, JoinColumn, OneToMany, JoinTable } from 'typeorm';
import { Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { VirtualColumn } from 'src/database/decorators';
import { UserEntity } from 'src/modules/users/entities';

import { PostEntity } from './post.entity';
import { PostCommentLikeEntity } from './post-comment-like.entity';

/**
 * [description]
 */
@Entity('post_comments')
export class PostCommentEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 5120, nullable: false })
  @Column({ type: 'varchar', length: 5120, nullable: false })
  public readonly text: string;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly postId: string;

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
  public readonly ownerId: string;

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
  @Column({ type: 'uuid', nullable: true })
  public readonly replyId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => PostCommentEntity, {
    onDelete: 'CASCADE',
    nullable: true,
    cascade: false,
  })
  public readonly reply?: Partial<PostCommentEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @OneToMany(() => PostCommentEntity, ({ reply }) => reply)
  public readonly replies: PostCommentEntity[];

  /**
   * [description]
   */
  @JoinTable()
  @ApiHideProperty()
  @OneToMany(() => PostCommentLikeEntity, ({ comment }) => comment)
  public readonly likes?: Partial<PostCommentLikeEntity>[];

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  @Transform(({ value }) => !!value)
  public readonly __is_liked?: boolean;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __likes_count?: string;
}
