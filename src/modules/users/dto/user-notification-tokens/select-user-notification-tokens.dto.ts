import { FindManyOptionsDto } from 'src/common/dto';

import { UserNotificationTokenEntity } from '../../entities';

/**
 * [description]
 */
export class SelectUserNotificationTokensDto extends FindManyOptionsDto<UserNotificationTokenEntity> {}
