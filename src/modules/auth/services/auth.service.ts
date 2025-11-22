import { FindOptionsWhere, FindOneOptions } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';

import { BadRequestException, HttpException, Injectable, Inject, Type } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';

import { generateCode, compare } from 'src/common/helpers';
import { ErrorTypeEnum } from 'src/common/enums';

import { SendMailService } from 'src/sendmail/services';
import { MailType } from 'src/sendmail/types';
import { ConfigService } from 'src/config';

import { UserRefreshTokensService, UsersService } from '../../users/services';
import { UserRefreshTokenEntity, UserEntity } from '../../users/entities';
import { UserStatusEnum } from 'src/modules/users/enums';

import {
  CreateProfileConfirmationDto,
  JwtRefreshTokenPayloadDto,
  JwtAccessTokenPayloadDto,
  ResponseCredentialsDto,
  ConfirmationEmailDto,
  SendResetPasswordDto,
  UpdatePasswordDto,
  CreateProfileDto,
  ResetPasswordDto,
  CredentialsDto,
  ReqAuthUserDto,
  JwtTokensDto,
} from '../dto';
import { CACHE_AUTH_PREFIX } from '../auth.constants';

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
   * Generate error in format
   * @param ErrorRef
   * @param errorType
   * @param error
   */
  public throwError(ErrorRef: Type<HttpException>, errorType: ErrorTypeEnum, error?: Error): never {
    throw new ErrorRef({ message: errorType, error });
  }

  /**
   * [description]
   * @param id
   * @param userRefreshToken
   */
  public generateAccessToken(
    { id }: Partial<UserEntity>,
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
    { id }: Partial<UserEntity>,
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
  public generateTokens(
    user: Partial<UserEntity>,
    userRefreshToken: UserRefreshTokenEntity,
  ): JwtTokensDto {
    const token = this.generateAccessToken(user, userRefreshToken);
    const refreshToken = this.generateRefreshToken(user, userRefreshToken);
    return { token, refreshToken };
  }

  /**
   * [description]
   * @param email
   * @param password
   */
  @Transactional()
  public async createToken(data: CredentialsDto): Promise<ResponseCredentialsDto> {
    const user = await this.validateUser({ email: data.email, status: UserStatusEnum.ACTIVATED });

    if (!(await this.validatePassword(data.password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);

    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      owner: { id: user.id },
    });

    await this.userRefreshTokensService.deleteOldRefreshTokens({ ownerId: user.id });
    const tokens = await this.generateTokens(user, refreshToken);

    return plainToInstance(ResponseCredentialsDto, { tokens, user });
  }

  /**
   * [description]
   * @param data
   */
  public async createUser(data: CreateProfileDto): Promise<Partial<MailType>> {
    const user = await this.usersService.createOne(data).catch(() => {
      return this.usersService
        .selectOne({ email: data.email, status: UserStatusEnum.PENDING })
        .catch(() => this.throwError(BadRequestException, ErrorTypeEnum.ALREADY_EXIST_ERROR));
    });

    const code = generateCode();
    await this.cacheManager.set(`${CACHE_AUTH_PREFIX}${user.id}`, code, this.cacheAuthTtl);

    const context = this.sendMailService.templateCtx.build_SING_UP_CODE(user, { code });
    return this.sendMailService.sendTemplatedMail(context);
  }

  /**
   * [description]
   * @param data
   */
  @Transactional()
  public async createUserAndConfirmationBySecurityCode(
    data: CreateProfileConfirmationDto,
  ): Promise<ResponseCredentialsDto> {
    const { id } = await this.validateEmailCode(data);
    const user = await this.usersService.updateOne({ id }, data);
    await this.cacheManager.del(`${CACHE_AUTH_PREFIX}${user.id}`);

    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({
      owner: { id },
    });

    await this.userRefreshTokensService.deleteOldRefreshTokens({ ownerId: id });
    const tokens = await this.generateTokens(user, refreshToken);

    return plainToInstance(ResponseCredentialsDto, { tokens, user });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async validateUser(
    conditions: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<ReqAuthUserDto> {
    const initialOptions: FindOneOptions<UserEntity> = {
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
      loadEagerRelations: false,
    };
    return this.usersService
      .selectOne(conditions, Object.assign(initialOptions, options))
      .catch((error) =>
        this.throwError(BadRequestException, ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS, error),
      );
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
    const user = await this.usersService
      .selectOne({ email }, { loadEagerRelations: false, select: { id: true, password: true } })
      .catch(() =>
        this.throwError(BadRequestException, ErrorTypeEnum.AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE),
      );

    const cacheCode = await this.cacheManager.get<string>(`${CACHE_AUTH_PREFIX}${user.id}`);
    if (cacheCode !== code)
      this.throwError(BadRequestException, ErrorTypeEnum.AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE);

    return user;
  }

  /**
   * [description]
   * @param data
   */
  public async sendEmailResetPassword(data: SendResetPasswordDto): Promise<void> {
    const user = await this.usersService.selectOne(
      { ...data, status: UserStatusEnum.ACTIVATED },
      { loadEagerRelations: false },
    );

    const code = generateCode();
    await this.cacheManager.set(`${CACHE_AUTH_PREFIX}${user.id}`, code, this.cacheAuthTtl);

    const context = await this.sendMailService.templateCtx.build_RESET_PASSWORD(user, { code });
    await this.sendMailService.sendTemplatedMail(context);
  }

  /**
   * [description]
   * @param data
   */
  @Transactional()
  public async resetPassword(data: ResetPasswordDto): Promise<UserEntity> {
    const { id, password } = await this.validateEmailCode(data);

    if (await this.validatePassword(data.password, password))
      throw new BadRequestException(ErrorTypeEnum.NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME);

    await this.cacheManager.del(`${CACHE_AUTH_PREFIX}${id}`);
    return this.usersService.updateOne({ id }, { password: data.password });
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async updatePassword(
    data: UpdatePasswordDto,
    user: Partial<UserEntity>,
  ): Promise<UserEntity> {
    if (!(await this.validatePassword(data.oldPassword, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne({ id: user.id }, { password: data.password });
  }
}
