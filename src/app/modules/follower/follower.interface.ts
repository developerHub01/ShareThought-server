import { Model, Types } from "mongoose";

export interface IFollower {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
}

export interface IFollowerModel extends Model<IFollower> {
  isFollowing(channelId: string, userId: string): Promise<boolean>;
  followToggle(channelId: string, userId: string): Promise<boolean>;
}
