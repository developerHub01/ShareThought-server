import { Schema } from "mongoose";
import { ChannelConstant } from "../../channel/channel.constant";
import { UserConstant } from "../../user/user.constant";
import {
  IModerator,
  IModeratorModel,
  IModeratorPermissions,
} from "../moderator.interface";

const moderatorPermissions = new Schema<IModeratorPermissions>({
  moderator: {
    type: Boolean,
  },
  post: {
    type: Boolean,
  },
  communityPost: {
    type: Boolean,
  },
  comment: {
    type: Boolean,
  },
  channel: {
    type: Boolean,
  },
});

const moderatorSchema = new Schema<IModerator, IModeratorModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    permissions: moderatorPermissions,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

moderatorSchema.index({ userId: 1, channelId: 1 }, { unique: true });
moderatorSchema.index({ userId: 1 });
moderatorSchema.index({ channelId: 1 });

export default moderatorSchema;
