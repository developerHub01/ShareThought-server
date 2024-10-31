import { ClientSession, Model, Types } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";
import { TAuthorType, TPostType } from "../../interface/interface";

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

export interface IPostReactionModel extends Model<IPostReaction> {
  totalPostReactionByPostId({
    postId,
    postType,
  }: {
    postId: string;
    postType: TPostType;
  }): Promise<unknown>;

  myReactionOnPost({
    postId,
    postType,
    authorId,
    authorIdType,
  }: {
    postId: string;
    postType: TPostType;
    authorId: string;
    authorIdType: TAuthorType;
  }): Promise<string | unknown>;

  togglePostReaction({
    postId,
    postType,
    authorId,
    authorIdType,
  }: {
    postId: string;
    postType: TPostType;
    authorId: string;
    authorIdType: TAuthorType;
  }): Promise<boolean | unknown>;

  reactOnPost({
    postId,
    postType,
    authorId,
    authorIdType,
    reactionType,
  }: {
    postId: string;
    postType: TPostType;
    authorId: string;
    authorIdType: TAuthorType;
    reactionType: TPostReactionType;
  }): Promise<unknown>;

  deleteAllReactionByPostId({
    postId,
    postType,
    session,
  }: {
    postId: string;
    postType: TPostType;
    session?: ClientSession;
  }): Promise<unknown>;
}
