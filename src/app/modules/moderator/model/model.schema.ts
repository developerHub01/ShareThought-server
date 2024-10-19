import { Schema } from "mongoose";
import { ChannelConstant } from "../../channel/channel.constant";
import { UserConstant } from "../../user/user.constant";
import {
  IChannelContextPermissions,
  ICommentContextPermissions,
  ICommunityPostContextPermissions,
  IModerator,
  IModeratorContextPermissions,
  IModeratorModel,
  IModeratorPermissions,
  IPostContextPermissions,
} from "../moderator.interface";

const moderatorContextPermissionSchema =
  new Schema<IModeratorContextPermissions>(
    {
      add: {
        type: Boolean,
        default: false,
        required: true,
      },
      canRemove: {
        type: Boolean,
        default: false,
        required: true,
      },
      update: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      _id: false,
    },
  );

const postContextPermissionSchema = new Schema<IPostContextPermissions>(
  {
    create: {
      type: Boolean,
      default: false,
      required: true,
    },
    update: {
      type: Boolean,
      default: false,
      required: true,
    },
    delete: {
      type: Boolean,
      default: false,
      required: true,
    },
    hide: {
      type: Boolean,
      default: false,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    pin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const communityPostContextPermissionSchema =
  new Schema<ICommunityPostContextPermissions>(
    {
      create: {
        type: Boolean,
        default: false,
        required: true,
      },
      update: {
        type: Boolean,
        default: false,
        required: true,
      },
      delete: {
        type: Boolean,
        default: false,
        required: true,
      },
      hide: {
        type: Boolean,
        default: false,
        required: true,
      },
      show: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      _id: false,
    },
  );

const commentContextPermissionSchema = new Schema<ICommentContextPermissions>(
  {
    create: {
      type: Boolean,
      default: false,
      required: true,
    },
    delete: {
      type: Boolean,
      default: false,
      required: true,
    },
    hide: {
      type: Boolean,
      default: false,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    pin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const channelContextPermissionSchema = new Schema<IChannelContextPermissions>(
  {},
  {
    _id: false,
  },
);

const moderatorPermissionsSchema = new Schema<IModeratorPermissions>(
  {
    moderator: moderatorContextPermissionSchema,
    post: postContextPermissionSchema,
    communityPost: communityPostContextPermissionSchema,
    comment: commentContextPermissionSchema,
    channel: channelContextPermissionSchema,
  },
  {
    _id: false,
  },
);

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
    /* means that is moderator accepted the request to be moderator */
    isVerified: {
      type: Boolean,
      default: false,
    },
    permissions: moderatorPermissionsSchema,
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
