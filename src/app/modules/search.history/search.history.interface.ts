import { Model, Types } from "mongoose";

export interface ISearchHistory {
  searchTerm: string;
  searchUserIdList: Array<Types.ObjectId>;
}
export interface ISearchHistoryModel extends Model<ISearchHistory> {}
