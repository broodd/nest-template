import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats';
import { UsersModule } from '../users';

import {
  PostCommentLikesController,
  PostCommentsController,
  PostLikesController,
  StoriesController,
  PostsController,
} from './controllers';
import {
  PostCommentLikesService,
  PostCommentsService,
  PostLikesService,
  StoriesService,
  PostsService,
} from './services';
import {
  PostCommentLikeEntity,
  PostCommentEntity,
  PostLikeEntity,
  StoryEntity,
  PostEntity,
} from './entities';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostCommentEntity,
      PostLikeEntity,
      PostCommentLikeEntity,
      StoryEntity,
    ]),
    ChatsModule,
    UsersModule,
  ],
  controllers: [
    PostsController,
    PostCommentsController,
    PostLikesController,
    PostCommentLikesController,
    StoriesController,
  ],
  providers: [
    PostsService,
    PostCommentsService,
    PostLikesService,
    PostCommentLikesService,
    StoriesService,
  ],
  exports: [
    PostsService,
    PostCommentsService,
    PostLikesService,
    PostCommentLikesService,
    StoriesService,
  ],
})
export class PostsModule {}
