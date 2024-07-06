import { Model, Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  commentAuthorId: Types.ObjectId;
  content: string;
  replies: Array<IComment>;
}

export interface ICreateComment {
  postId: Types.ObjectId;
  commentAuthorId: Types.ObjectId;
  content: string;
}

export interface ICommentModel extends Model<IComment> {
  findComment(id: string): Promise<unknown>;
  deleteComment(id: string, userId: string): Promise<boolean | unknown>;
  updateComment(
    payload: ICreateComment,
    commentId: string,
    userId: string,
  ): Promise<unknown>;
  isMyComment(commentId: string, userId: string): Promise<boolean | unknown>;
  isMyPost(postId: string, userId: string): Promise<boolean | unknown>;
}
