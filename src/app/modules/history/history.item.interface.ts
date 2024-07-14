import { Model, Types } from "mongoose";

export interface IHistoryItem {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IHistoryItemModel extends Model<IHistoryItem> {
  addPostInHistory(postId: string, userId: string): Promise<unknown>;
  removePostFromHistory(historyItemId: string, userId: string): Promise<unknown>;
  clearPostFromHistory(userId: string): Promise<unknown>;
}
