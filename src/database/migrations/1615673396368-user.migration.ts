import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';
import { UserRoleEnum } from 'src/modules/users/enums';

const password =
  '357fa5484137ddfd5a5b:32e0569e0c7e1ac0fd902a3db866904098e08cf1e1a1e8cd7fa8e5941b7f7c46866a9d577ece5778a32ce4b2c812e547607d111da263d51d63f9ba5135a3a421'; // password
const data: Partial<UserEntity>[] = [
  {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    email: 'admin@gmail.com',
    role: UserRoleEnum.ADMIN,
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
