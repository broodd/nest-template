import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserRoleEnum, UserStatusEnum } from 'src/modules/users/enums';
import { UserEntity } from 'src/modules/users/entities';

// Password1
const password =
  'c311eb49ab82ba9c111a:fe845cd4d04feb3ac89b7e218bc785eb3edab59681002194a5ded3eacbb3d34f0c59418932095c774aa8278f6f131d505908bce2c02882e082628e9d78ea8e8a';

const data: Partial<UserEntity>[] = [
  {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    email: 'admin@gmail.com',
    role: UserRoleEnum.ADMIN,
    status: UserStatusEnum.ACTIVATED,
    password,
  },
];

export class user1615673396368 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    await connection.synchronize();
    const repository = connection.getRepository(UserEntity);
    await repository.save(data).catch((e) => console.error(e));
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).delete(data.map(({ id }) => id));
  }
}
