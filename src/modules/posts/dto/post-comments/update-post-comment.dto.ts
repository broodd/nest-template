import { PartialType } from '@nestjs/swagger';

import { CreatePostCommentDto } from './create-post-comment.dto';

/**
 * [description]
 */
export class UpdatePostCommentDto extends PartialType(CreatePostCommentDto) {}
