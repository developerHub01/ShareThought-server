import { ClientSession, Document } from "mongoose";
import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IChannel } from "../channel/channel.interface";

export interface IModeratorContextPermissions {
  add: boolean;
  canRemove: boolean;
  update: boolean;
}

export interface IPostContextPermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
  hide: boolean;
  show: boolean;
  pin: boolean;
  unpin: boolean;
}

export interface ICommunityPostContextPermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
  hide: boolean;
  show: boolean;
}

export interface ICommentContextPermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
  hide: boolean;
  show: boolean;
  pin: boolean;
  unpin: boolean;
}

export interface IChannelContextPermissions {}

export interface IModeratorPermissions {
  moderator?: IModeratorContextPermissions;
  post?: IPostContextPermissions;
  communityPost?: ICommunityPostContextPermissions;
  comment?: ICommentContextPermissions;
  channel?: IChannelContextPermissions;
}

export interface IModerator extends Document {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
  isVerified?: boolean;
  permissions: IModeratorPermissions;
}

export interface IModeratorPopulated
  extends Omit<IModerator, "userId" | "channelId"> {
  userId: IUser;
  channelId: IChannel;
}

export interface IModeratorPayload
  extends Omit<IModerator, "userId" | "channelId"> {
  userId: string;
}

export interface IModeratorRequestEmailData {
  moderatorId: string;
  channelCover: string;
  channelAvatar: string;
  channelName: string;
  moderatorName: string;
  moderatorAvatar: string;
  moderatorEmail: string;
}

export interface IModeratorRequestAcceptanceEmailData {
  channelCover: string;
  channelName: string;
  authorName: string;
  authorEmail: string;
  moderatorName: string;
  moderatorAvatar: string;
  moderatorEmail: string;
  dateAccepted: Date;
}

export interface IModeratorResignationEmailData {
  authorName: string;
  authorEmail: string;
  moderatorName: string;
  moderatorEmail: string;
  channelName: string;
  channelId: string;
  leaveDate: Date;
}

export interface IModeratorRemoveEmailData {
  moderatorName: string;
  channelName: string;
  moderatorEmail: string;
  removedDate: Date;
}

export interface IModeratorModel extends Model<IModerator> {
  channelModeratorData({
    channelId,
    userId,
  }: {
    channelId: string;
    userId: string;
  }): Promise<IModerator | null>;

  getChannelModeratorsCount({
    channelId,
  }: {
    channelId: string;
  }): Promise<number>;

  isAlreadyModerator({
    channelId,
    userId,
  }: {
    channelId: string;
    userId: string;
  }): Promise<boolean>;

  addChannelModerator({
    channelId,
    payload,
  }: {
    channelId: string;
    payload: IModeratorPayload;
  }): Promise<unknown>;

  resign({
    userId,
    moderatorId,
    session,
  }: {
    userId: string;
    moderatorId: string;
    session?: ClientSession;
  }): Promise<unknown>;

  acceptModeratorRequest({
    userId,
    moderatorId,
    session,
  }: {
    userId: string;
    moderatorId: string;
    session?: ClientSession;
  }): Promise<unknown>;
}
