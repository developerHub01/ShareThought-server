import { Schema } from "mongoose";
import { IChannel, IChannelModel } from "../channel.interface";
import { ChannelConstant } from "../channel.constant";
import { UserConstant } from "../../user/user.constant";

const channelSchema = new Schema<IChannel, IChannelModel>(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
      maxLength: ChannelConstant.CHANNEL_NAME_MAX_LENGTH,
      minLength: ChannelConstant.CHANNEL_NAME_MIN_LENGTH,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    channelDescription: {
      trim: true,
      type: String,
      maxLength: ChannelConstant.CHANNEL_DESCRIPTION_MAX_LENGTH,
    },
    channelAvatar: {
      trim: true,
      type: String,
    },
    channelCover: {
      trim: true,
      type: String,
      default: ChannelConstant.CHANNEL_DEFAULT_COVER,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    /* 
    moderatorCount, moderatorPendingCount 
    select: false
    bacuse by default we dont't want that it will be public 
    it only shown to channel author and moderators
    */
    moderatorCount: {
      type: Number,
      default: 0,
      select: false,
    },
    moderatorPendingCount: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default channelSchema;
