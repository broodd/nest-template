import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'src/modules/users/entities';

import { CommonEntity } from 'src/common/entities';

/**
 * [description]
 */
@Entity('relationships')
@Index('relationships__target_owner', ['target', 'owner'], { unique: true })
export class RelationshipEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  public readonly isBlocked?: boolean;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly targetId: string;

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
  public readonly target: Partial<UserEntity>;

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
}
