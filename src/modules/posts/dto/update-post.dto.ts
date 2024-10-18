import { PartialType } from '@nestjs/swagger';

import { CreatePostDto } from './create-post.dto';

/**
 * [description]
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
