import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoleEnum } from 'src/modules/users/enums';
import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from 'src/modules/users/entities';

import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  const ctx = { getHandler: () => null } as ExecutionContext;
  const expected = { id: '1', role: UserRoleEnum.USER } as UserEntity;

  it('should be defined', () => {
    expect(new JwtAuthGuard(new Reflector())).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should be return user entity without roles metadata', () => {
      const reflector = { get: () => null } as unknown as Reflector;
      const received = new JwtAuthGuard(reflector).handleRequest(null, expected, null, ctx);
      expect(received).toEqual(expected);
    });

    it('should be return unauthorized exception - AUTH_INVALID_TOKEN', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_TOKEN);
      try {
        new JwtAuthGuard(new Reflector()).handleRequest(null, null, new Error(), ctx);
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return unauthorized exception - AUTH_UNAUTHORIZED', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);
      try {
        new JwtAuthGuard(new Reflector()).handleRequest(null, null, null, ctx);
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return forbidden exception', () => {
      const error = new ForbiddenException(ErrorTypeEnum.AUTH_FORBIDDEN);
      try {
        const reflector = { get: () => [UserRoleEnum.ADMIN] } as unknown as Reflector;
        new JwtAuthGuard(reflector).handleRequest(null, expected, null, ctx);
      } catch (received) {
        expect(received).toBeInstanceOf(ForbiddenException);
        expect(received).toEqual(error);
      }
    });
  });
});
