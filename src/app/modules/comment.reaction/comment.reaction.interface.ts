import { CommentConstant } from "./../comment/comment.constant";
import { Model, Types } from "mongoose";

const reactionTypeList: Array<string> = Object.values(
  CommentConstant.COMMENT_REACTION_TYPES,
);

export type TCommentReactionType = (typeof reactionTypeList)[number];

export interface ICommentReaction {
  commentId: Types.ObjectId;
  userId: Types.ObjectId;
  reactionType: TCommentReactionType;
}
export interface ICommentReactionModel extends Model<ICommentReaction> {
  totalCommentReactionByCommentId(commentId: string): Promise<unknown>;
  myReactionOnComment(
    userId: string,
    commentId: string,
  ): Promise<string | unknown>;
  toggleCommentReaction(
    userId: string,
    commentId: string,
  ): Promise<boolean | unknown>;
  reactOnComment(
    userId: string,
    commentId: string,
    reactionType: TCommentReactionType,
  ): Promise<unknown>;
}
