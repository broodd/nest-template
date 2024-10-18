import { PartialType } from '@nestjs/swagger';

import { CreateGroupDto } from './create-group.dto';

/**
 * [description]
 */
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
