import { Model, Types } from "mongoose";

export interface IPost {
  channelId?: Types.ObjectId;
  title: string;
  content: string;
  banner: string;
  views?: number;
  isPublished: boolean;
  // tags: Array<Types.ObjectId>;
}

export interface ICreatePost {
  title: string;
  content: string;
  banner?: string;
  isPublished?: boolean;
  // tags: Array<string>;
}

export interface IPostModel extends Model<IPost> {
  isMyPost(postId: string, userId: string): Promise<boolean>;
  findPostById(id: string, userId?:string): Promise<unknown>;
  isPublicPostById(id: string): Promise<boolean | unknown>;
  deletePost(postId: string, userId: string): Promise<unknown>;
}
