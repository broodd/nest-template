import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, ({ refreshTokens }) => refreshTokens, {
    onDelete: 'CASCADE',
  })
  public readonly owner: Partial<UserEntity>;
}
