import { Document } from "mongoose";
import { Model, Types } from "mongoose";

export interface IModeratorContextPermissions {
  add: boolean;
  remove: boolean;
}
export interface IPostContextPermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
  hide: boolean;
  show: boolean;
  pin: boolean;
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
  delete: boolean;
  hide: boolean;
  show: boolean;
  pin: boolean;
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
  isVerified: boolean;
  permissions: IModeratorPermissions;
}

export interface IModeratorModel extends Model<IModerator> {
  // isFollowing(channelId: string, userId: string): Promise<boolean>;

  getChannelModeratorsCount(channelId: string): Promise<number>;
}
