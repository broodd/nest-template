import { FindOneOptionsDto } from 'src/common/dto';

import { GroupEntity } from '../entities';

/**
 * [description]
 */
export class SelectGroupDto extends FindOneOptionsDto<GroupEntity> {}
