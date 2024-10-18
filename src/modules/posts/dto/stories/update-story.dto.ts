import { PartialType } from '@nestjs/swagger';

import { CreateStoryDto } from './create-story.dto';

/**
 * [description]
 */
export class UpdateStoryDto extends PartialType(CreateStoryDto) {}
