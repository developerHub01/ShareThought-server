import { Document, Model } from "mongoose";
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { ChannelConstant } from "./channel.constant";

export type TChannelRole =
  (typeof ChannelConstant.CHANNEL_USER_ROLES)[keyof typeof ChannelConstant.CHANNEL_USER_ROLES];

export interface ICreateChannel {
  channelName: string;
  authorId: string;
}

export interface IChannelModeratorCount {
  moderatorCount: number;
  moderatorPendingCount: number;
}

export interface IChannel extends IChannelModeratorCount, Document {
  channelName: string;
  authorId: Types.ObjectId;
  channelDescription: string;
  channelAvatar: string;
  channelCover: string;
  followerCount: number;
}

export interface IChannelPopulated extends Omit<IChannel, "authorId"> {
  authorId: IUser;
}

export interface IChannelModel extends Model<IChannel> {
  isChannelExist({ id }: { id: string }): Promise<boolean>;

  isChannelMine({
    channelId,
    authorId,
  }: {
    channelId: string;
    authorId: string;
  }): Promise<boolean>;
}
