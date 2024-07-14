import { ClientSession, Model, Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  commentAuthorId: Types.ObjectId;
  parentCommentId: Types.ObjectId;
  content: string;
  replies: Array<Types.ObjectId>;
  commentImage: string;
}

export interface ICreateComment {
  postId: string;
  commentAuthorId?: string;
  parentCommentId?: string;
  content?: string;
  commentImage: string;
}

export interface ICommentModel extends Model<IComment> {
  findComment(id: string): Promise<unknown>;
  createComment(payload: ICreateComment): Promise<unknown>;
  deleteCommentsWithReplies(
    commentId: string,
    session?: ClientSession,
  ): Promise<unknown>;
  deleteComment(id: string, userId: string): Promise<boolean | unknown>;
  deleteAllCommentByPostId(postId: string, userId: string): Promise<unknown>;
  updateComment(
    payload: ICreateComment,
    commentId: string,
    userId: string,
  ): Promise<unknown>;
  isMyComment(commentId: string, userId: string): Promise<boolean | unknown>;
  isMyPost(commentId: string, userId: string): Promise<boolean | unknown>;
}
