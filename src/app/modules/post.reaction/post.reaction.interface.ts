import { ClientSession, Model, Types } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";

const reactionTypeList: Array<string> = Object.values(
  PostReactionConstant.POST_REACTION_TYPES,
);

export type TPostReactionType = (typeof reactionTypeList)[number];

export interface IPostReaction {
  userId?: Types.ObjectId;
  postId?: Types.ObjectId;
  channelId?: Types.ObjectId;
  reactionType: TPostReactionType;
}

export interface IPostReactionModel extends Model<IPostReaction> {
  totalPostReactionByPostId(postId: string): Promise<unknown>;
  myReactionOnPost(
    postId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
  ): Promise<string | unknown>;
  togglePostReaction(
    postId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
  ): Promise<boolean | unknown>;
  reactOnPost(
    postId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
    reactionType: TPostReactionType,
  ): Promise<unknown>;
  deleteAllReactionByPostId(
    postId: string,
    userId: string,
    session?: ClientSession,
  ): Promise<unknown>;
}
