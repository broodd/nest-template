import { UserEntity } from 'src/modules/users/entities';
import { FindOneOptionsDto } from 'src/common/dto';

/**
 * [description]
 */
export class SelectProfileDto extends FindOneOptionsDto<UserEntity> {}
