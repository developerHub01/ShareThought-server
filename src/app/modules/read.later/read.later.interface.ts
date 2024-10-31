import { ClientSession } from "mongoose";
import { Model, Types } from "mongoose";

export interface IReadLater {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IReadLaterModel extends Model<IReadLater> {
  isMyReadLaterListPost({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<boolean | unknown>;

  isExistInReadLaterList({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean | unknown>;

  removeFromReadLaterListWhenPostIsDeleting({
    postId,
    session,
  }: {
    postId: string;
    session: ClientSession;
  }): Promise<unknown>;
}
