import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/services';
import { PaginationDto } from 'src/common/dto';

import { GroupSubscriberEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class GroupSubscribersService extends CommonService<
  GroupSubscriberEntity,
  PaginationDto<GroupSubscriberEntity>
> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(GroupSubscriberEntity)
    public readonly repository: Repository<GroupSubscriberEntity>,
  ) {
    super(GroupSubscriberEntity, repository, PaginationDto<GroupSubscriberEntity>);
  }
}
