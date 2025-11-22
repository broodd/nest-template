import { JoinColumn, ManyToOne, Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/entities';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
@Entity('log_errors')
export class LogErrorEntity extends CommonEntity {
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public readonly method?: string;
  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public readonly url?: string;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  public readonly body?: any;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  public readonly params?: any;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  public readonly query?: any;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  public readonly error?: any;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  public readonly userId?: string;

  /**
   * [description]
   */
  @JoinColumn()
  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: false,
  })
  public readonly user?: Partial<UserEntity>;
}
