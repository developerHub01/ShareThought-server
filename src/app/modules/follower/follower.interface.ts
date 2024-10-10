import { Model, Types } from "mongoose";

export interface IFollower {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
}

export interface IFollowerCount {
  count: number;
}

export interface IFollowerModel extends Model<IFollower> {
  isFollowing(channelId: string, userId: string): Promise<boolean>;

  getChannelFollowersCount(channelId: string): Promise<IFollowerCount>;

  followToggle(channelId: string, userId: string): Promise<boolean>;
}
