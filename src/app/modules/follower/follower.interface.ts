import { Document } from "mongoose";
import { Model, Types } from "mongoose";

export interface IFollower extends Document {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
}

export interface IFollowerCount {
  count: number;
}

export interface ISocketGetFollowersQuery {
  channelId: string;
  page?: number;
  limit?: number;
  timePeriod?:
    | "last7Days"
    | "last28Days"
    | "last90Days"
    | "last365Days"
    | "lifetime";
  dateOrder?: "asc" | "desc";
  skip?: number;
}

export interface IFollowerListFollower {
  id: string;
  avatar?: string;
  userName: string;
  fullName: string;
  followedAt: Date;
}

export interface IFollowerModel extends Model<IFollower> {
  isFollowing(channelId: string, userId: string): Promise<boolean>;

  getChannelFollowersCount(channelId: string): Promise<IFollowerCount>;

  followToggle(channelId: string, userId: string): Promise<boolean>;
}
