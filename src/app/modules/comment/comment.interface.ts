import { IChannel } from "./../channel/channel.interface";
import { IUser } from "./../user/user.interface";
import { ICommunityPost } from "./../community.post/community.post.interface";
import { IPost } from "./../post/post.interface";
import { ClientSession, Model, Types } from "mongoose";
import { TAuthorType } from "../../interface/interface";

export interface IComment {
  postId?: Types.ObjectId;
  communityPostId?: Types.ObjectId;
  commentAuthorId?: Types.ObjectId;
  commentAuthorChannelId?: Types.ObjectId;
  parentCommentId: Types.ObjectId;
  content: string;
  replies: Array<Types.ObjectId>;
  commentImage: string;
  isPinned?: boolean;
  isHidden?: boolean;
}

export interface ICommentPopulated
  extends Omit<
    IChannel,
    | "postId"
    | "communityPostId"
    | "commentAuthorId"
    | "commentAuthorChannelId"
    | "parentCommentId"
  > {
  postId?: IPost;
  communityPostId?: ICommunityPost;
  commentAuthorId?: IUser;
  commentAuthorChannelId?: IChannel;
  parentCommentId: IComment;
  isPinned?: boolean;
  isHidden?: boolean;
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
    authorId: string,
    authorType: TAuthorType,
  ): Promise<boolean | unknown>;

  isCommentOfMyAnyChannel(userId: string, commentId: string): Promise<unknown>;

  isMyPost(commentId: string, userId: string): Promise<boolean | unknown>;

  haveAccessToDelete(
    commentId: string,
    authorId: string,
    authorType: TAuthorType,
  ): Promise<unknown>;

  createComment(payload: ICreateComment): Promise<unknown>;

  deleteCommentsWithReplies(
    commentId: string,
    session?: ClientSession,
  ): Promise<unknown>;
}
