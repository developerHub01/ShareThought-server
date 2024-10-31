import { Document } from "mongoose";
import { Model, Types } from "mongoose";

export interface IPost extends Document {
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
  isPostOfMyAnyChannel({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<boolean>;

  isMyPost({
    postId,
    channelId,
  }: {
    postId: string;
    channelId: string;
  }): Promise<boolean>;

  findPostById({
    id,
    channelId,
  }: {
    id: string;
    channelId: string;
  }): Promise<unknown>;

  isPublicPostById({ id }: { id: string }): Promise<boolean | unknown>;
}
