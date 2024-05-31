import { PartialType } from '@nestjs/swagger';

import { CreateUserNotificationTokenDto } from './create-user-notification-token.dto';

/**
 * [description]
 */
export class UpdateUserNotificationTokenDto extends PartialType(CreateUserNotificationTokenDto) {}
