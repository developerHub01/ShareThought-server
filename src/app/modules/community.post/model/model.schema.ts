import { Document, Schema } from "mongoose";
import {
  ICommunityPost,
  ICommunityPostImageType,
  ICommunityPostModel,
  ICommunityPostPollOption,
  ICommunityPostPollOptionWithImage,
  ICommunityPostPollType,
  ICommunityPostPollWithImageType,
  ICommunityPostQuizOption,
  ICommunityPostQuizType,
  ICommunitySharedPostType,
} from "../community.post.interface";
import { CommunityPostConstant } from "../community.post.constant";
import { UserConstant } from "../../user/user.constant";
import { ChannelConstant } from "../../channel/channel.constant";
import { CommunityPostUtils } from "../community.post.utils";

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
    participateList: {
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
      participateList: {
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
      _id: false,
    },
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
      _id: false,
    },
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
    participateList: {
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
    _id: false,
  },
);

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
    _id: false,
  },
);

/* ================ Community post quiz schema end ================================ */

/* ================ Community main schema start ================================ */
const communityPostSchema = new Schema<ICommunityPost, ICommunityPostModel>(
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
  },
);

const modifyCommunityPost = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: Document<any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ret: Record<string, any>,
) => {
  const postData = doc as unknown as ICommunityPost;
  const { POLL, POLL_WITH_IMAGE, QUIZ } =
    CommunityPostConstant.COMMUNITY_POST_TYPES;

  if (
    postData?.postType &&
    ![POLL, POLL_WITH_IMAGE, QUIZ].includes(postData.postType as string)
  )
    return ret;

  const postDetailsField = postData.postQuizDetails
    ? "postQuizDetails"
    : postData.postPollDetails
      ? "postPollDetails"
      : "postPollWithImageDetails";

  ret.totalResponse = Number(
    ret[postDetailsField].options.reduce(
      (count: number, option: { participateList: Array<string> }) =>
        count + option["participateList"]?.length,
      0,
    ),
  );

  ret[postDetailsField].options = ret[postDetailsField].options.map(
    (option: Partial<ICommunityPostQuizOption>) => {
      const totalUsers = Number(
        option["participateList"] && option["participateList"].length,
      );

      delete option["participateList"];

      return {
        ...option,
        totalUsers,
        successRate: CommunityPostUtils.calculateSuccessRate(
          totalUsers,
          ret.totalResponse,
        ),
      };
    },
  );

  return ret;
};

communityPostSchema.set("toJSON", {
  transform: (doc, ret) => modifyCommunityPost(doc, ret),
});
communityPostSchema.set("toObject", {
  transform: (doc, ret) => modifyCommunityPost(doc, ret),
});

export default communityPostSchema;
