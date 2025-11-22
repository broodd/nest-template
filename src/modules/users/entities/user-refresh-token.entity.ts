import { ManyToOne, Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from './user.entity';

/**
 * [description]
 */
@Entity('user_refresh_tokens')
export class UserRefreshTokenEntity extends CommonEntity {
  /**
   * [description]
   */
  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 149 })
  public ppid: string;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  public readonly ownerId: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, ({ refreshTokens }) => refreshTokens, {
    onDelete: 'CASCADE',
  })
  public readonly owner: Partial<UserEntity>;
}
