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
    moderatorCount: {
      type: Number,
      default: 0,
    },
    moderatorPendingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default channelSchema;
