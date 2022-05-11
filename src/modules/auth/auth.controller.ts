import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Query,
  Patch,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { User } from 'src/common/decorators';

import { UserEntity } from '../users/entities';
import { UserRefreshTokensService, UsersService } from '../users/services';

import {
  JwtTokensDto,
  CredentialsDto,
  UpdateEmailDto,
  CreateProfileDto,
  SelectProfileDto,
  ResetPasswordDto,
  UpdateProfileDto,
  UpdatePasswordDto,
  JwtRefreshTokenDto,
  SendResetPasswordDto,
  ConfirmationEmailDto,
} from './dto';
import { AuthService } from './auth.service';
import { JwtRefreshGuard, JwtAuthGuard } from './guards';

/**
 * [description]
 */
@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  /**
   * [description]
   * @param usersService
   * @param authService
   */
  constructor(
    private readonly userRefreshTokensService: UserRefreshTokensService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * [description]
   * @param data
   */
  @Post('signin')
  public async createToken(@Body() data: CredentialsDto): Promise<JwtTokensDto> {
    return this.authService.createToken(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('signup')
  public async createUser(@Body() data: CreateProfileDto): Promise<JwtTokensDto> {
    return this.authService.createUser(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('log-out')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: JwtRefreshTokenDto })
  public async logOut(@User() user: UserEntity): Promise<void> {
    const [refreshToken] = user.refreshTokens;
    await this.userRefreshTokensService.deleteOne({ id: refreshToken.id, owner: { id: user.id } });
  }

  /**
   * [description]
   * @param user
   */
  @Post('refresh-tokens')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: JwtRefreshTokenDto })
  public async refreshTokens(@User() user: UserEntity): Promise<JwtTokensDto> {
    const [oldRefreshToken] = user.refreshTokens;
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      id: oldRefreshToken.id,
      owner: { id: user.id },
    });
    return this.authService.generateTokens(user, refreshToken);
  }

  /**
   * [description]
   * @param data
   */
  @Post('reset-password/send/email')
  public async sendResetPassword(@Body() data: SendResetPasswordDto): Promise<void> {
    return this.authService.sendResetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('reset-password')
  public async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('validate/email/code')
  public async confirmationEmail(@Body() data: ConfirmationEmailDto): Promise<void> {
    await this.authService.validateEmailCode(data);
  }

  /**
   * [description]
   * @param id
   * @param options
   */
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async selectUser(
    @User() { id }: UserEntity,
    @Query() options: SelectProfileDto,
  ): Promise<UserEntity> {
    return this.usersService.selectOne({ id }, options);
  }

  /**
   * [description]
   * @param user
   * @param data
   */
  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @Body() data: UpdateProfileDto,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    return this.usersService.updateOne({ id: user.id }, data);
  }

  /**
   * [description]
   * @param user
   * @param data
   */
  @Patch('profile/password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateUserPassword(
    @Body() data: UpdatePasswordDto,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    return this.authService.updatePassword(data, user);
  }

  /**
   * [description]
   * @param user
   * @param data
   */
  @Patch('profile/email')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateUserEmail(
    @Body() data: UpdateEmailDto,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    return this.authService.updateEmail(data, user);
  }
}
