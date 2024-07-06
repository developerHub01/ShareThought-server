import { Model, Types } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";

const reactionTypeList: Array<string> = Object.values(
  PostReactionConstant.POST_REACTION_TYPES,
);

export type TPostReactionType = (typeof reactionTypeList)[number];

export interface IPostReaction {
  userId?: Types.ObjectId;
  postId: Types.ObjectId;
  reactionType: TPostReactionType;
}

export interface IPostReactionModel extends Model<IPostReaction> {
  totalPostReactionByPostId(postId: string): Promise<unknown>;
  myReactionOnPost(userId: string, postId: string): Promise<string | unknown>;
  togglePostReaction(
    userId: string,
    postId: string,
  ): Promise<boolean | unknown>;
  reactOnPost(
    userId: string,
    postId: string,
    reactionType: TPostReactionType,
  ): Promise<unknown>;
}
