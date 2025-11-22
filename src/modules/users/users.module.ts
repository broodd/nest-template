import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserNotificationTokensService, UserRefreshTokensService, UsersService } from './services';
import { UserNotificationTokenEntity, UserRefreshTokenEntity, UserEntity } from './entities';
import { UserNotificationTokensController, UsersController } from './controllers';

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
