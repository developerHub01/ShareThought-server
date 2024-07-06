import { Schema, model } from "mongoose";
import { IChannel, IChannelModel } from "./channel.interface";
import { ChannelConstant } from "./channel.constant";

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
      ref: "User",
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
  },
  {
    timestamps: true,
  },
);

channelSchema.pre("save", function (next) {
  this.channelAvatar = `https://avatar.iran.liara.run/username?username=${this.channelName}`;
  return next();
});

// is channel exist
channelSchema.statics.isChannelExist = async (id: string) => {
  return Boolean(await ChannelModel.findById(id));
};

// is that my channel or not
channelSchema.statics.isChannelMine = async (
  channelId: string,
  authorId: string,
) => {
  return Boolean(
    await ChannelModel.findOne({
      _id: channelId,
      authorId,
    }),
  );
};

export const ChannelModel = model<IChannel, IChannelModel>(
  "Channel",
  channelSchema,
);
