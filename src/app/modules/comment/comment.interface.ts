import { ClientSession, Model, Types } from "mongoose";

export interface IComment {
  postId?: Types.ObjectId;
  communityPostId?: Types.ObjectId;
  commentAuthorId?: Types.ObjectId;
  commentAuthorChannelId?: Types.ObjectId;
  parentCommentId: Types.ObjectId;
  content: string;
  replies: Array<Types.ObjectId>;
  commentImage: string;
}

export interface ICreateComment {
  postId?: string;
  communityPostId?: string;
  commentAuthorId?: string;
  commentAuthorChannelId?: string;
  parentCommentId?: string;
  content?: string;
  commentImage: string;
}

export interface ICommentModel extends Model<IComment> {
  isMyComment(
    commentId: string,
    id: string,
    idType: "userId" | "channelId",
  ): Promise<boolean | unknown>;
  isMyPost(commentId: string, userId: string): Promise<boolean | unknown>;
  haveAccessToDelete(
    commentId: string,
    userId: string,
    channelId?: string,
  ): Promise<unknown>;
  findComment(id: string): Promise<unknown>;
  createComment(payload: ICreateComment): Promise<unknown>;
  deleteCommentsWithReplies(
    commentId: string,
    session?: ClientSession,
  ): Promise<unknown>;
  deleteComment(id: string): Promise<boolean | unknown>;
  deleteAllCommentByPostId(
    postId: string,
    communityPostId: string,
  ): Promise<unknown>;
  updateComment(payload: ICreateComment, commentId: string): Promise<unknown>;
}
