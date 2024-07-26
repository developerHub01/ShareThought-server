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
  totalCommentReactionByCommentId(commentId: string): Promise<unknown>;
  myReactionOnComment(
    commentId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
  ): Promise<string | unknown>;
  deleteCommentReactionByCommentId(
    commentId: string,
    session?: ClientSession,
  ): Promise<unknown>;
  toggleCommentReaction(
    commentId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
  ): Promise<boolean | unknown>;
  reactOnComment(
    commentId: string,
    authorId: string,
    authorIdType: "userId" | "channelId",
    reactionType: TCommentReactionType,
  ): Promise<unknown>;
}
