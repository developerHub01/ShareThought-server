import { Model, Types } from "mongoose";

export interface IHistorySetting {
  isHistoryActive?: boolean;
  userId: Types.ObjectId;
  userType: "guest" | "user";
}

export interface IHistorySettingModel extends Model<IHistorySetting> {
  createHistorySetting(userId: string): Promise<unknown>;
  isMyHistoryActive(userId: string): Promise<boolean | unknown>;
  toggleHistoryActivity(userId: string): Promise<unknown>;
}
