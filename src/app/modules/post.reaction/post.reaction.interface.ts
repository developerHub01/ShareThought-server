import { ClientSession, Model, Types } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";

const reactionTypeList: Array<string> = Object.values(
  PostReactionConstant.POST_REACTION_TYPES,
);

export type TPostReactionType = (typeof reactionTypeList)[number];

export interface IPostReaction {
  userId?: Types.ObjectId;
  communityPostId?: Types.ObjectId;
  postId?: Types.ObjectId;
  channelId?: Types.ObjectId;
  reactionType: TPostReactionType;
}

export type TPostType = "blogPost" | "communityPost";
export type TAuthorType = "userId" | "channelId";

export interface IPostReactionModel extends Model<IPostReaction> {
  totalPostReactionByPostId(
    postId: string,
    postType: TPostType,
  ): Promise<unknown>;

  myReactionOnPost(
    postId: string,
    postType: TPostType,
    authorId: string,
    authorIdType: TAuthorType,
  ): Promise<string | unknown>;

  togglePostReaction(
    postId: string,
    postType: TPostType,
    authorId: string,
    authorIdType: TAuthorType,
  ): Promise<boolean | unknown>;

  reactOnPost(
    postId: string,
    postType: TPostType,
    authorId: string,
    authorIdType: TAuthorType,
    reactionType: TPostReactionType,
  ): Promise<unknown>;
  
  deleteAllReactionByPostId(
    postId: string,
    postType: TPostType,
    session?: ClientSession,
  ): Promise<unknown>;
}
