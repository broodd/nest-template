import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/services';

import { GroupSubscriberEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';

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
