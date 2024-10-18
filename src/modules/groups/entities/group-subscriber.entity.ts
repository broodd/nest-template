import { Column, Entity, ManyToOne, JoinTable, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';
import { GroupEntity } from './group.entity';

/**
 * [description]
 */
@Entity('group_subscribers')
@Index('group_subscribers__group_user', ['group', 'user'], { unique: true })
export class GroupSubscriberEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly groupId: string;

  /**
   * [description]
   */
  @JoinTable()
  @ManyToOne(() => GroupEntity, ({ subscribers }) => subscribers)
  public readonly group: Partial<GroupEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly userId: string;

  /**
   * [description]
   */
  @JoinTable()
  @ManyToOne(() => UserEntity, ({ groups }) => groups)
  public readonly user: Partial<UserEntity>;
}
