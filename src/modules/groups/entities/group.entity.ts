import { Column, Entity, ManyToOne, JoinColumn, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { VirtualColumn } from 'src/database/decorators';
import { CommonEntity } from 'src/common/entities';

import { PostEntity } from 'src/modules/posts/entities';
import { FileEntity } from 'src/modules/files/entities';

import { GroupSubscriberEntity } from './group-subscriber.entity';

/**
 * [description]
 */
@Entity('groups')
export class GroupEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty({ maxLength: 128 })
  @Column({ type: 'varchar', length: 128, nullable: false })
  public readonly name: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: () => FileEntity })
  @ManyToOne(() => FileEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: true,
    eager: true,
  })
  public readonly cover: Partial<FileEntity>;

  /**
   * [description]
   */
  @JoinTable()
  @OneToMany(() => PostEntity, ({ group }) => group)
  public readonly posts?: Partial<PostEntity>[];

  /**
   * [description]
   */
  @JoinTable()
  @OneToMany(() => GroupSubscriberEntity, ({ group }) => group)
  public readonly subscribers?: Partial<GroupSubscriberEntity>[];

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly lastPost?: Partial<PostEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @VirtualColumn()
  public readonly __subscribers_count?: string;
}
