import { Document, Model } from "mongoose";
import { Types } from "mongoose";
import { TDocumentType } from "../../interface/interface";
import { IUser } from "../user/user.interface";

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

export interface IModeratedChannelListInitial {
  _id: string;
  channelId: TDocumentType<IChannel>;
  permissions: {
    moderator: {
      add: boolean;
      canRemove: boolean;
    };
  };
}

export interface IChannelModel extends Model<IChannel> {
  isChannelExist(id: string): Promise<boolean>;

  isChannelMine(channelId: string, authorId: string): Promise<boolean>;

  createChannel(payload: ICreateChannel): Promise<TDocumentType<IChannel>>;

  updateChannel(
    id: string,
    payload: Partial<IChannel>,
  ): Promise<TDocumentType<IChannel>>;

  deleteChannel(id: string): Promise<unknown>;

  channelModeratorCount(channelId: string): Promise<IChannelModeratorCount>;
}
