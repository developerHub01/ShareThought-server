
import { ICommunityPost, ICommunityPostImageType, ICommunityPostModel, ICommunityPostPollOption, ICommunityPostPollOptionWithImage, ICommunityPostPollType, ICommunityPostPollWithImageType, ICommunityPostQuizOption, ICommunityPostQuizType, ICommunitySharedPostType } from "./community.post.interface";
import { ChannelConstant } from "../channel/channel.constant";
import { CommunityPostConstant } from "./community.post.constant";
import { Schema } from "mongoose";
import { UserConstant } from "../user/user.constant";

const communityPostImageSchema = new Schema<ICommunityPostImageType>(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const communitySharedPostSchema = new Schema<ICommunitySharedPostType>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
      required: true,
    },
  },
  {
    _id: false,
  },
);

/* ================ Community post pull schema start ================================ */

const communityPostPullOptionShcema = new Schema<ICommunityPostPollOption>(
  {
    text: {
      type: String,
      required: true,
      minlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH,
      maxlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH,
    },
    polledUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: UserConstant.USER_COLLECTION_NAME,
        },
      ],
      default: [],
      select: false,
    },
  },
  {
    _id: false,
  },
);

const communityPostPullWithImageOptionShcema =
  new Schema<ICommunityPostPollOptionWithImage>(
    {
      text: {
        type: String,
        trim: true,
        required: true,
        minlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH,
        maxlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH,
      },
      image: {
        type: String,
        trim: true,
        required: true,
      },
      polledUsers: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: UserConstant.USER_COLLECTION_NAME,
          },
        ],
        default: [],
        select: true,
      },
    },
    {
      _id: false,
    },
  );

[communityPostPullOptionShcema, communityPostPullWithImageOptionShcema].map(
  (schema) =>
    schema.virtual("totalPolled").get(function () {
      return this?.polledUsers?.length;
    }),
);

const communityPostPullSchema = new Schema<ICommunityPostPollType>(
  {
    options: {
      type: [communityPostPullOptionShcema],
      validate: {
        validator: function (v: Array<unknown>) {
          return (
            v.length >=
            CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST
          );
        },
        message: `Minimum ${CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST} pull option is required`,
      },
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    _id: false,
  },
);

const communityPostPullWithImageSchema =
  new Schema<ICommunityPostPollWithImageType>(
    {
      options: {
        type: [communityPostPullWithImageOptionShcema],
        validate: {
          validator: function (v: Array<unknown>) {
            return (
              v.length >=
              CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST
            );
          },
          message: `Minimum ${CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST} pull option is required`,
        },
        required: true,
      },
    },
    {
      toJSON: {
        virtuals: true,
      },
      _id: false,
    },
  );

[communityPostPullSchema, communityPostPullWithImageSchema].map((schema) =>
  schema.virtual("totalPolled").get(function () {
    return this?.options?.reduce(
      (acc, curr) => acc + curr?.polledUsers?.length,
      0,
    );
  }),
);

/* ================ Community post pull schema end ================================ */

/* ================ Community post quiz schema start ================================ */

const communityPostQuizOptionShcema = new Schema<ICommunityPostQuizOption>(
  {
    text: {
      type: String,
      trim: true,
      required: true,
      minlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH,
      maxlength: CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH,
    },
    isCurrectAnswer: {
      type: Boolean,
      required: true,
      default: false,
    },
    currectAnswerExplaination: {
      type: String,
      trim: true,
    },
    answeredUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: UserConstant.USER_COLLECTION_NAME,
        },
      ],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    _id: false,
  },
);

communityPostQuizOptionShcema.virtual("totalPolled").get(function () {
  return this?.answeredUsers?.length;
});

const communityPostQuizSchema = new Schema<ICommunityPostQuizType>(
  {
    options: {
      type: [communityPostQuizOptionShcema],
      validate: {
        validator: function (v: Array<unknown>) {
          return (
            v.length >=
            CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST
          );
        },
        message: `Minimum ${CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST} quiz option is required`,
      },
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    _id: false,
  },
);

communityPostQuizSchema.virtual("totalAnswered").get(function () {
  return this?.options?.reduce(
    (acc, curr) => acc + curr?.answeredUsers?.length,
    0,
  );
});

/* ================ Community post quiz schema end ================================ */

/* ================ Community main schema start ================================ */
export const communityPostSchema = new Schema<ICommunityPost, ICommunityPostModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: CommunityPostConstant.COMMUNITY_POST_TEXT_MAX_LENGTH,
      minLength: CommunityPostConstant.COMMUNITY_POST_TEXT_MIN_LENGTH,
    },
    postType: {
      type: String,
      enum: Object.keys(CommunityPostConstant.COMMUNITY_POST_TYPES),
      default: CommunityPostConstant.COMMUNITY_POST_TYPES["TEXT"],
    },
    publihedAt: {
      type: Date,
      default: Date.now(),
    },
    scheduledTime: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    postImageDetails: communityPostImageSchema,
    postSharedPostDetails: communitySharedPostSchema,
    postPollDetails: communityPostPullSchema,
    postPollWithImageDetails: communityPostPullWithImageSchema,
    postQuizDetails: communityPostQuizSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

communityPostSchema.virtual("totalVote").get(function () {
  if (
    !(Number(!!this.postPollDetails) + Number(!!this.postPollWithImageDetails))
  )
    return;

  return (
    (this.postPollDetails || this.postPollWithImageDetails)?.options?.reduce(
      (acc, curr) => acc + curr?.polledUsers?.length,
      0,
    ) || 0
  );
});

communityPostSchema.virtual("totalAnswer").get(function () {
  if (!this.postQuizDetails) return;

  return (
    this.postQuizDetails?.options?.reduce(
      (acc, curr) => acc + curr?.answeredUsers?.length,
      0,
    ) || 0
  );
});
