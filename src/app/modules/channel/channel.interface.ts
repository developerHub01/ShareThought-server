import { Model } from "mongoose";
import { Types } from "mongoose";
import { TDocumentType } from "../../interface/interface";

export interface ICreateChannel {
  channelName: string;
  authorId: string;
}
export interface IChannel {
  channelName: string;
  authorId: Types.ObjectId;
  channelDescription: string;
  channelAvatar: string;
  channelCover: string;
}

export interface IChannelModel extends Model<IChannel> {
  isChannelExist(id: string): Promise<boolean>;

  isChannelMine(channelId: string, authorId: string): Promise<boolean>;

  createChannel(
    payload: ICreateChannel,
  ): Promise<TDocumentType<ICreateChannel>>;

  updateChannel(
    id: string,
    payload: Partial<IChannel>,
  ): Promise<TDocumentType<ICreateChannel>>;

  deleteChannel(id: string): Promise<unknown>;
}
