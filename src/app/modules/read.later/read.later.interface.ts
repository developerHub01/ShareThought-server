import { ClientSession } from "mongoose";
import { Model, Types } from "mongoose";

export interface IReadLater {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IReadLaterModel extends Model<IReadLater> {
  isMyReadLaterListPost(id: string, userId: string): Promise<boolean | unknown>;
  isExistInReadLaterList(
    postId: string,
    userId: string,
  ): Promise<boolean | unknown>;
  addToReadLaterList(postId: string, userId: string): Promise<unknown>;
  removeFromReadLaterList(postId: string, userId: string): Promise<unknown>;
  removeFromReadLaterListById(id: string, userId: string): Promise<unknown>;
  removeFromReadLaterListWhenPostIsDeleting(
    postId: string,
    userId: string,
    session: ClientSession,
  ): Promise<unknown>;
}
