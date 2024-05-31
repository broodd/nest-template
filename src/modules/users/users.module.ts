import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserNotificationTokensService, UserRefreshTokensService, UsersService } from './services';
import { UserEntity, UserNotificationTokenEntity, UserRefreshTokenEntity } from './entities';
import { UsersController } from './controllers';
import { SendMailModule } from 'src/sendmail';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity, UserNotificationTokenEntity]),
    SendMailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRefreshTokensService, UserNotificationTokensService],
  exports: [UsersService, UserRefreshTokensService, UserNotificationTokensService],
})
export class UsersModule {}
