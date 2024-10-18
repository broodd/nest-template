import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from 'src/modules/users/dto';

/**
 * [description]
 */
export class CreateProfileDto extends PickType(CreateUserDto, ['password', 'email']) {}
