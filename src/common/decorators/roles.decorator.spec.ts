import { Test, TestingModule } from '@nestjs/testing';
import { ApiOperation } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { UserRoleEnum } from 'src/modules/users/enums';

import { UseRole } from './roles.decorator';

describe('UseRole', () => {
  const decorator = UseRole(UserRoleEnum.SUPER_ADMIN);

  it('should be defined', () => {
    expect(decorator).toBeDefined();
  });

  it('should be return custom summary into swagger/apiOperation metadata', async () => {
    @Controller()
    class TestController {
      @UseRole(UserRoleEnum.SUPER_ADMIN)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public foo(): void {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const [operation, roles, security] = ['swagger/apiOperation', 'roles', 'swagger/apiSecurity'];
    const received = module.get<TestController>(TestController).foo;

    expect(Reflect.getMetadataKeys(received)).toEqual([operation, roles, security]);
    expect(Reflect.getMetadata(roles, received)).toEqual([UserRoleEnum.SUPER_ADMIN]);
    expect(Reflect.getMetadata(operation, received)).toEqual({
      summary: `[ROLE: ${UserRoleEnum.SUPER_ADMIN}]`,
    });
  });

  it('should be return modify summary into swagger/apiOperation metadata', async () => {
    @Controller()
    class TestController {
      @UseRole(UserRoleEnum.SUPER_ADMIN)
      @ApiOperation({ summary: 'Test' })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public foo(): void {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const [operation, roles, security] = ['swagger/apiOperation', 'roles', 'swagger/apiSecurity'];
    const received = module.get<TestController>(TestController).foo;

    expect(Reflect.getMetadataKeys(received)).toEqual([operation, roles, security]);
    expect(Reflect.getMetadata(roles, received)).toEqual([UserRoleEnum.SUPER_ADMIN]);
    expect(Reflect.getMetadata(operation, received)).toEqual({
      summary: `[ROLE: ${UserRoleEnum.SUPER_ADMIN}]: Test`,
    });
  });

  it('should be return merge options into swagger/apiOperation metadata', async () => {
    @Controller()
    class TestController {
      @UseRole(UserRoleEnum.SUPER_ADMIN)
      @ApiOperation({ deprecated: true })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public foo(): void {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const [operation, roles, security] = ['swagger/apiOperation', 'roles', 'swagger/apiSecurity'];
    const received = module.get<TestController>(TestController).foo;

    expect(Reflect.getMetadataKeys(received)).toEqual([operation, roles, security]);
    expect(Reflect.getMetadata(roles, received)).toEqual([UserRoleEnum.SUPER_ADMIN]);
    expect(Reflect.getMetadata(operation, received)).toEqual({
      summary: `[ROLE: ${UserRoleEnum.SUPER_ADMIN}]`,
      deprecated: true,
    });
  });
});
