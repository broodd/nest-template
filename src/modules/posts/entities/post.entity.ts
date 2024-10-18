import { Column, Entity, ManyToOne, JoinTable, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { CommonEntity } from 'src/common/entities';

import { GroupEntity } from 'src/modules/groups/entities';
import { UserEntity } from 'src/modules/users/entities';
import { FileEntity } from 'src/modules/files/entities';
import { VirtualColumn } from 'src/database/decorators';

import { PostCommentEntity } from './post-comment.entity';
import { PostLikeEntity } from './post-like.entity';
import { CreateLocationDto } from '../dto';

/**
 * [description]
 */
@Entity('posts')
export class PostEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 5120, nullable: true })
  @Column({ type: 'varchar', length: 5120, nullable: true })
  public readonly description?: string;

  /**
   * [description]
   */
  @ApiProperty({
    type: CreateLocationDto,
    description: 'format (longitude, latitude)',
    externalDocs: {
      description: 'format (longitude, latitude)',
      url: 'https://www.postgis.net/workshops/postgis-intro/geography.html#using-geography',
    },
  })
  @Column({ type: 'geography', nullable: true })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  public location?: CreateLocationDto | string;

  /**
   * [description]
   */
  @JoinTable()
  @ApiProperty({ type: () => [FileEntity] })
  @ManyToMany(() => FileEntity, { onDelete: 'CASCADE', nullable: true, cascade: true })
  public readonly images?: Partial<FileEntity>[];

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
  public readonly groupId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty()
  @ManyToOne(() => GroupEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: false,
  })
  public readonly group?: Partial<GroupEntity>;

  /**
   * [description]
   */
  @JoinTable()
  @ApiHideProperty()
  @OneToMany(() => PostLikeEntity, ({ post }) => post)
  public readonly likes?: Partial<PostLikeEntity>[];

  /**
   * [description]
   */
  @JoinTable()
  @ApiHideProperty()
  @OneToMany(() => PostCommentEntity, ({ post }) => post)
  public readonly comments?: Partial<PostCommentEntity>[];

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly distance?: string;

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

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __comments_count?: string;
}
