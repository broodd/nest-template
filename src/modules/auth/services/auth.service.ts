import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';

import { ErrorTypeEnum } from 'src/common/enums';
import { SendMailService } from 'src/sendmail';
import { compare } from 'src/common/helpers';

import { UserRefreshTokensService, UsersService } from '../../users/services';
import { UserEntity, UserRefreshTokenEntity } from '../../users/entities';

import { TemplateNameEnum, TemplateSubjectEnum } from 'src/sendmail/enums';
import { TemplatedMailResetPasswordType } from 'src/sendmail/types';
import { CACHE_AUTH_PREFIX } from '../auth.constants';
import { UserStatusEnum } from '../../users/enums';
import {
  UpdatePasswordByCreateConfirmationDto,
  JwtRefreshTokenPayloadDto,
  JwtAccessTokenPayloadDto,
  SendResetPasswordDto,
  ConfirmationEmailDto,
  CreateProfileDto,
  ResetPasswordDto,
  CredentialsDto,
  JwtTokensDto,
} from '../dto';

/**
 * [description]
 */
@Injectable()
export class AuthService {
  private readonly expiresInRefreshToken;
  private readonly expiresInAccessToken;
  private readonly secretRefreshToken;
  private readonly secretAccessToken;
  private readonly cacheAuthTtl: number;

  /**
   * [description]
   * @param userRefreshTokensService
   * @param sendMailService
   * @param configService
   * @param usersService
   * @param jwtService
   */
  constructor(
    private readonly userRefreshTokensService: UserRefreshTokensService,
    private readonly sendMailService: SendMailService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.expiresInRefreshToken = this.configService.get<number>('JWT_EXPIRES_REFRESH_TOKEN');
    this.expiresInAccessToken = this.configService.get<number>('JWT_EXPIRES_ACCESS_TOKEN');
    this.secretRefreshToken = this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN');
    this.secretAccessToken = this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN');
    this.cacheAuthTtl = this.configService.get<number>('CACHE_AUTH_TTL');
  }

  /**
   * [description]
   * @param id
   * @param userRefreshToken
   */
  public generateAccessToken(
    { id }: UserEntity,
    { id: refreshTokenId }: UserRefreshTokenEntity,
  ): string {
    const payload: JwtAccessTokenPayloadDto = { id, refreshTokenId };
    return this.jwtService.sign(payload, {
      expiresIn: this.expiresInAccessToken,
      secret: this.secretAccessToken,
    });
  }

  /**
   * [description]
   * @param id
   * @param userRefreshToken
   */
  public generateRefreshToken(
    { id }: UserEntity,
    { id: refreshTokenId, ppid }: UserRefreshTokenEntity,
  ): string {
    const payload: JwtRefreshTokenPayloadDto = { id, refreshTokenId, ppid };
    return this.jwtService.sign(payload, {
      expiresIn: this.expiresInRefreshToken,
      secret: this.secretRefreshToken,
    });
  }

  /**
   * [description]
   * @param user
   * @param userRefreshToken
   */
  public generateTokens(user: UserEntity, userRefreshToken: UserRefreshTokenEntity): JwtTokensDto {
    const token = this.generateAccessToken(user, userRefreshToken);
    const refreshToken = this.generateRefreshToken(user, userRefreshToken);
    return { token, refreshToken };
  }

  /**
   * [description]
   * @param digits
   * @param size
   */
  public generateCode(digits = 6, size = 20): string {
    const buffer = randomBytes(size);
    const value = buffer.readUInt32BE(0x0f) % 10 ** digits;
    return value.toString().padStart(digits, '0');
  }

  /**
   * [description]
   * @param email
   * @param password
   */
  public async createToken({ email, password }: CredentialsDto): Promise<JwtTokensDto> {
    const user = await this.validateUser({ email });
    if (!(await this.validatePassword(password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      owner: { id: user.id },
    });
    await this.userRefreshTokensService.deleteOldRefreshTokens({ ownerId: user.id });
    return this.generateTokens(user, refreshToken);
  }

  /**
   * [description]
   * @param data
   */
  public async createUser(data: CreateProfileDto): Promise<JwtTokensDto> {
    const user = await this.usersService.createOne(data);
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      owner: { id: user.id },
    });
    return this.generateTokens(user, refreshToken);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async validateUser(
    conditions: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const initialOptions: FindOneOptions<UserEntity> = {
      select: { id: true, password: true, role: true },
      loadEagerRelations: false,
    };
    return this.usersService
      .selectOne(conditions, Object.assign(initialOptions, options))
      .catch(() => {
        throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      });
  }

  /**
   * [description]
   * @param data
   * @param encrypted
   */
  public async validatePassword(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted).catch(() => {
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    });
  }

  /**
   * [description]
   * @param data
   */
  public async validateEmailCode(data: ConfirmationEmailDto): Promise<Partial<UserEntity>> {
    const { code, email } = data;
    const user = await this.usersService.selectOne(
      { email },
      { loadEagerRelations: false, select: { id: true, password: true } },
    );

    const cacheCode = await this.cacheManager.get<string>(`${CACHE_AUTH_PREFIX}${user.id}`);
    if (cacheCode !== code)
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE);

    return user;
  }

  /**
   * [description]
   * @param data
   */
  public async sendResetPassword(data: SendResetPasswordDto): Promise<void> {
    const { id } = await this.usersService.selectOne(data, {
      loadEagerRelations: false,
      select: { id: true },
    });

    const code = this.generateCode();
    await this.cacheManager.set(`${CACHE_AUTH_PREFIX}${id}`, code, this.cacheAuthTtl);

    await this.sendMailService.sendTemplatedEmail<TemplatedMailResetPasswordType>({
      to: [data.email],
      subject: TemplateSubjectEnum.RESET_PASSWORD,
      template: TemplateNameEnum.RESET_PASSWORD,
      context: { code, url: '' },
    });
  }

  /**
   * [description]
   * @param data
   */
  public async resetPassword(data: ResetPasswordDto): Promise<void> {
    const { id, password } = await this.validateEmailCode(data);

    if (await this.validatePassword(data.password, password))
      throw new BadRequestException(ErrorTypeEnum.NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME);

    await this.cacheManager.del(`${CACHE_AUTH_PREFIX}${id}`);
    await this.usersService.updateOne({ id }, { password: data.password });
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async updatePasswordByCreateCreateConfirmation(
    data: UpdatePasswordByCreateConfirmationDto,
  ): Promise<UserEntity> {
    const user = await this.validateUser({ email: data.email });
    if (!(await this.validatePassword(data.temporaryPassword, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne(
      { id: user.id },
      { password: data.password, status: UserStatusEnum.ACTIVATED },
    );
  }
}
