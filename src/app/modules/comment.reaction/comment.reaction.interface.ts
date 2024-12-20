import { TAuthorType } from "../../interface/interface";
import { CommentConstant } from "./../comment/comment.constant";
import { ClientSession, Model, Types } from "mongoose";

const reactionTypeList: Array<string> = Object.values(
  CommentConstant.COMMENT_REACTION_TYPES,
);

export type TCommentReactionType = (typeof reactionTypeList)[number];

export interface ICommentReaction {
  commentId: Types.ObjectId;
  userId?: Types.ObjectId;
  channelId?: Types.ObjectId;
  reactionType: TCommentReactionType;
}
export interface ICommentReactionModel extends Model<ICommentReaction> {
  totalCommentReactionByCommentId({
    commentId,
  }: {
    commentId: string;
  }): Promise<number>;

  myReactionOnComment({
    commentId,
    authorId,
    authorIdType,
  }: {
    commentId: string;
    authorId: string;
    authorIdType: TAuthorType;
  }): Promise<string | null>;

  deleteCommentReactionByCommentId({
    commentId,
    session,
  }: {
    commentId: string;
    session?: ClientSession;
  }): Promise<unknown>;

  toggleCommentReaction({
    commentId,
    authorId,
    authorIdType,
  }: {
    commentId: string;
    authorId: string;
    authorIdType: TAuthorType;
  }): Promise<boolean | unknown>;

  reactOnComment({
    commentId,
    authorId,
    authorIdType,
    reactionType,
  }: {
    commentId: string;
    authorId: string;
    authorIdType: TAuthorType;
    reactionType: TCommentReactionType;
  }): Promise<unknown>;
}
