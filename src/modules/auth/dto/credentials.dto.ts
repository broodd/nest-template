import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from 'src/modules/users/dto';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {}
