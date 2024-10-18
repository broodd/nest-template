import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/modules/users';
import { SendMailModule } from 'src/sendmail';

import { JwtRefreshTokenStrategy, JwtStrategy } from './strategies';
import { AuthController } from './controllers';
import { AuthService } from './services';

/**
 * [description]
 */
@Module({
  imports: [PassportModule, JwtModule.register({}), SendMailModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
