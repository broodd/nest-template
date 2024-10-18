import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats';
import { UsersModule } from '../users';

import {
  PostCommentEntity,
  PostCommentLikeEntity,
  PostEntity,
  PostLikeEntity,
  StoryEntity,
} from './entities';
import {
  PostCommentLikesController,
  PostCommentsController,
  PostLikesController,
  PostsController,
  StoriesController,
} from './controllers';
import {
  PostCommentLikesService,
  PostCommentsService,
  PostLikesService,
  PostsService,
  StoriesService,
} from './services';

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
