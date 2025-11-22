import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GroupSubscribersController, GroupsController } from './controllers';
import { GroupSubscribersService, GroupsService } from './services';
import { GroupSubscriberEntity, GroupEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupSubscriberEntity])],
  controllers: [GroupsController, GroupSubscribersController],
  providers: [GroupsService, GroupSubscribersService],
  exports: [GroupsService, GroupSubscribersService],
})
export class GroupsModule {}
