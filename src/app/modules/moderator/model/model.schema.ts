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
      },
      canRemove: {
        type: Boolean,
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
    },
    update: {
      type: Boolean,
    },
    delete: {
      type: Boolean,
    },
    hide: {
      type: Boolean,
    },
    show: {
      type: Boolean,
    },
    pin: {
      type: Boolean,
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
      },
      update: {
        type: Boolean,
      },
      delete: {
        type: Boolean,
      },
      hide: {
        type: Boolean,
      },
      show: {
        type: Boolean,
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
    },
    delete: {
      type: Boolean,
    },
    hide: {
      type: Boolean,
    },
    show: {
      type: Boolean,
    },
    pin: {
      type: Boolean,
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
