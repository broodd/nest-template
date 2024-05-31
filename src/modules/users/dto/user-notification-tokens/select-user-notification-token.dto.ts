import { FindOneOptionsDto } from 'src/common/dto';
import { UserNotificationTokenEntity } from '../../entities';

/**
 * [description]
 */
export class SelectUserNotificationTokenDto extends FindOneOptionsDto<UserNotificationTokenEntity> {}
