import { Schema } from "mongoose";
import { IFollower, IFollowerModel } from "../follower.interface";
import { ChannelConstant } from "../../channel/channel.constant";
import { UserConstant } from "../../user/user.constant";

const followerSchema = new Schema<IFollower, IFollowerModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

followerSchema.index({ userId: 1, channelId: 1 }, { unique: true });
followerSchema.index({ userId: 1 });
followerSchema.index({ channelId: 1 });

export default followerSchema;
