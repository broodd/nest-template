import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GroupsController, GroupSubscribersController } from './controllers';
import { GroupsService, GroupSubscribersService } from './services';
import { GroupEntity, GroupSubscriberEntity } from './entities';

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
