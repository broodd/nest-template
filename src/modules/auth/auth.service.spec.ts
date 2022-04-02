import { CacheModule, ConflictException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { SendGridService } from 'src/sendgrid';
import { ConfigService } from 'src/config';
import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity, UserRefreshTokenEntity } from '../users/entities';

import { AuthService } from './auth.service';
import { CreateProfileDto } from './dto';
import { UserRefreshTokensService, UsersService } from '../users/services';

describe('AuthService', () => {
  const PASSPORT_EXPIRES = 0;
  const expected = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    email: 'admin@gmail.com',
  } as UserEntity;
  const refreshToken = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    ppid: 'some-ppid',
  } as UserRefreshTokenEntity;

  let usersService: UsersService;
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'some-secret',
        }),
        CacheModule.register(),
      ],
      providers: [
        AuthService,
        {
          provide: SendGridService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => PASSPORT_EXPIRES,
          },
        },
        {
          provide: UsersService,
          useValue: {
            selectOne: async () => new UserEntity(),
            createOne: async () => new UserEntity(),
          },
        },
        {
          provide: UserRefreshTokensService,
          useValue: {
            generateAndCreateOne: async () => new UserRefreshTokenEntity(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateToken', () => {
    const received = service.generateTokens(expected, refreshToken);
    expect(received.token).toEqual(expect.any(String));
  });

  describe('createToken', () => {
    it('should be return jwt entity', async () => {
      jest.spyOn(service, 'validatePassword').mockResolvedValueOnce(true);

      const received = await service.createToken({ ...expected, password: 'password' });
      expect(received.token).toEqual(expect.any(String));
    });

    it('should be return unauthorized exception', async () => {
      jest.spyOn(service, 'validatePassword').mockResolvedValueOnce(false);
      const error = new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      return service.createToken({ ...expected, password: '' }).catch((err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('createUser', () => {
    const data = {
      email: 'email',
      password: 'password',
    } as CreateProfileDto;

    it('should be return jwt entity', async () => {
      const received = await service.createUser(data);
      expect(received.token).toEqual(expect.any(String));
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
      return service.createUser({ ...data, email: expected.email }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('validateUser', () => {
    it('should be return user entity', async () => {
      jest.spyOn(usersService, 'selectOne').mockResolvedValueOnce(expected);
      const received = await service.validateUser({ id: expected.id });
      expect(received.id).toEqual(expected.id);
    });

    it('should be return unauthorized exception', async () => {
      jest.spyOn(usersService, 'selectOne').mockRejectedValueOnce(new Error());
      const error = new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      return service.validateUser({ id: expected.id, password: '' }).catch((err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err).toEqual(error);
      });
    });
  });
});
