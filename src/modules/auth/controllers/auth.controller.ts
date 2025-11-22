import { FastifyReply } from 'fastify';

import {
  ClassSerializerInterceptor,
  UseInterceptors,
  Controller,
  UseGuards,
  Patch,
  Query,
  Body,
  Post,
  Get,
  Res,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from 'src/common/decorators';

import { ConfigService, ConfigMode } from 'src/config';
import { MailType } from 'src/sendmail/types';

import { UserRefreshTokensService, UsersService } from '../../users/services';
import { UserStatusEnum } from 'src/modules/users/enums';
import { UserEntity } from '../../users/entities';

import {
  CreateProfileConfirmationDto,
  ResponseCredentialsDto,
  ConfirmationEmailDto,
  SendResetPasswordDto,
  UpdatePasswordDto,
  CreateProfileDto,
  ResetPasswordDto,
  SelectProfileDto,
  UpdateProfileDto,
  CredentialsDto,
  JwtTokensDto,
} from '../dto';
import { ReqAuthUserDto } from '../dto/req-auth-user.dto';
import { JwtRefreshGuard, JwtAuthGuard } from '../guards';
import { AuthService } from '../services';

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
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * [description]
   * @param reply
   * @param tokens
   */
  public setCookieTokens(reply: FastifyReply, tokens: JwtTokensDto): void {
    reply.setCookie('accessToken', tokens.token, {
      secure: this.configService.getMode(ConfigMode.production),
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    });
    reply.setCookie('refreshToken', tokens.refreshToken, {
      secure: this.configService.getMode(ConfigMode.production),
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    });
  }

  /**
   * [description]
   * @param data
   */
  @Post('signin')
  public async createToken(
    @Body() data: CredentialsDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<ResponseCredentialsDto> {
    const response = await this.authService.createToken(data);

    this.setCookieTokens(reply, response.tokens);
    return response;
  }

  /**
   * [description]
   * @param data
   */
  @Post('signup')
  public async createUser(@Body() data: CreateProfileDto): Promise<Partial<MailType>> {
    return this.authService.createUser(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('signup/confirmation')
  public async signUpConfirmation(
    @Body() data: CreateProfileConfirmationDto,
  ): Promise<ResponseCredentialsDto> {
    data.status = UserStatusEnum.ACTIVATED;
    return this.authService.createUserAndConfirmationBySecurityCode(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('log-out')
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('refreshToken')
  public async logOut(
    @User() user: ReqAuthUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<void> {
    reply.clearCookie('accessToken');
    reply.clearCookie('refreshToken');

    const [refreshToken] = user.refreshTokens;
    await this.userRefreshTokensService.deleteOne({ id: refreshToken.id, ownerId: user.id });
  }

  /**
   * [description]
   * @param user
   */
  @Post('refresh-tokens')
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('refreshToken')
  public async refreshTokens(
    @User() user: ReqAuthUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<JwtTokensDto> {
    const [oldRefreshToken] = user.refreshTokens;
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      id: oldRefreshToken.id,
      owner: { id: user.id },
    });
    const tokens = await this.authService.generateTokens(user, refreshToken);

    this.setCookieTokens(reply, tokens);
    return tokens;
  }

  /**
   * [description]
   * @param data
   */
  @Post('reset-password/send/email')
  @ApiOperation({ summary: 'Send email with temporary code for reset password' })
  public async sendResetPassword(@Body() data: SendResetPasswordDto): Promise<void> {
    return this.authService.sendEmailResetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('reset-password')
  @ApiOperation({ summary: 'Set new password by temporary reset-password code' })
  public async resetPassword(@Body() data: ResetPasswordDto): Promise<UserEntity> {
    return this.authService.resetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('validate/email/code')
  @ApiOperation({
    summary: 'Validate code from email (signup, reset password). Request only for validation',
  })
  public async validateEmailCode(@Body() data: ConfirmationEmailDto): Promise<void> {
    await this.authService.validateEmailCode(data);
  }

  /**
   * [description]
   * @param id
   * @param options
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('accessToken')
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
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('accessToken')
  public async updateUser(
    @Body() data: UpdateProfileDto,
    @User() user: ReqAuthUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateOne({ id: user.id }, data);
  }

  /**
   * [description]
   * @param data
   */
  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  @ApiCookieAuth('accessToken')
  public async updatePassword(
    @Body() data: UpdatePasswordDto,
    @User() user: ReqAuthUserDto,
  ): Promise<UserEntity> {
    return this.authService.updatePassword(data, user);
  }
}
