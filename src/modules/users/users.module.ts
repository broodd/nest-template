import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserNotificationTokensService, UserRefreshTokensService, UsersService } from './services';
import { UserEntity, UserNotificationTokenEntity, UserRefreshTokenEntity } from './entities';
import { UsersController, UserNotificationTokensController } from './controllers';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity, UserNotificationTokenEntity]),
  ],
  controllers: [UsersController, UserNotificationTokensController],
  providers: [UsersService, UserRefreshTokensService, UserNotificationTokensService],
  exports: [UsersService, UserRefreshTokensService, UserNotificationTokensService],
})
export class UsersModule {}
