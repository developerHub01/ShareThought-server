import { Model, Types } from "mongoose";
import { TDocumentType } from "../../interface/interface";

export interface IPost {
  channelId?: Types.ObjectId;
  title: string;
  content: string;
  banner: string;
  views?: number;
  isPublished?: boolean;
  publishedAt?: Date;
  scheduledTime?: Date;
  tags: Array<Types.ObjectId>;
}

export interface ICreatePost {
  title: string;
  content: string;
  banner?: string;
  isPublished?: boolean;
  scheduledTime?: Date;
  tags: Array<string>;
}

export interface IPostModel extends Model<IPost> {
  isPostOfMyAnyChannel(userId: string, postId: string): Promise<boolean>;

  isMyPost(postId: string, channelId: string): Promise<boolean>;

  findPostById(id: string, channelId: string): Promise<unknown>;

  isPublicPostById(id: string): Promise<boolean | unknown>;

  createPost(payload: ICreatePost): Promise<TDocumentType<IPost>>;

  updatePost(payload: Partial<ICreatePost>, postId: string): Promise<TDocumentType<IPost>>;

  deletePost(postId: string): Promise<unknown>;
}
