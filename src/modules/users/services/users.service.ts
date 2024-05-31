import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PaginationUsersDto } from '../dto';
import { CommonService } from 'src/common/services';
import { SendMailService } from 'src/sendmail';
import { UserEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class UsersService extends CommonService<UserEntity, PaginationUsersDto> {
  /**
   * [description]
   * @param repository
   * @param sendMailService
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly repository: Repository<UserEntity>,
    public readonly sendMailService: SendMailService,
  ) {
    super(UserEntity, repository, PaginationUsersDto);
  }
}
