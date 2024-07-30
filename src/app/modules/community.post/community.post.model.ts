import mongoose, { model, Schema } from "mongoose";
import {
  ICommunityPost,
  ICreateCommunityPost,
  ICommunityPostModel,
  ICommunityPostImageType,
  ICommunityPostPollOption,
  ICommunityPostPollOptionWithImage,
  ICommunityPostPollType,
  ICommunityPostPollWithImageType,
  ICommunityPostQuizOption,
  ICommunityPostQuizType,
  ICommunitySharedPostType,
} from "./community.post.interface";
import { UserConstant } from "../user/user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ChannelConstant } from "../channel/channel.constant";
import errorHandler from "../../errors/errorHandler";
import { CommentModel } from "../comment/comment.model";
import { PostReactionModel } from "../post.reaction/post.reaction.model";
import { CommunityPostConstant } from "./community.post.constant";

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

/* ================ Community main schema end ================================ */

communityPostSchema.pre<ICommunityPost>("save", async function (next) {
  if (this.scheduledTime && this.isPublished)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "scheduled post can't be public",
    );

  if (!this.scheduledTime && !this.isPublished)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "post have to be public or scheduled",
    );

  /* Checking is there multiple type or not */
  if (
    Number(!!this.postImageDetails) +
      Number(!!this.postSharedPostDetails) +
      Number(!!this.postPollDetails) +
      Number(!!this.postPollWithImageDetails) +
      Number(!!this.postQuizDetails) >
    1
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only one post type can be provided",
    );

  if (this.postPollDetails || this.postPollWithImageDetails) {
    const totalPolledUsers =
      (this.postPollDetails || this.postPollWithImageDetails)?.options?.reduce(
        (acc, curr) => {
          if (curr?.polledUsers) acc += curr?.polledUsers?.length;

          return acc;
        },
        0,
      ) || 0;

    if (totalPolledUsers)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't select poll when creating a poll",
      );
  } else if (this.postQuizDetails) {
    /* Validation of poastQuiz =============== */
    const initialCounts = {
      currectAnswerCount: 0,
      currectAnswerExplainationCount: 0,
      answeredUsersCount: 0,
    };

    // console.log("===========");
    // console.log(this.postQuizDetails.options);

    const {
      currectAnswerCount,
      currectAnswerExplainationCount,
      answeredUsersCount,
    } = this.postQuizDetails?.options?.reduce(
      (acc, curr) => {
        if (!curr?.isCurrectAnswer && curr.currectAnswerExplaination)
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "quiz options wrong ans can't have explaination",
          );

        if (curr?.isCurrectAnswer) acc.currectAnswerCount++;

        // console.log(curr);

        if (curr?.currectAnswerExplaination)
          acc.currectAnswerExplainationCount++;

        if (curr?.answeredUsers)
          acc.answeredUsersCount += curr?.answeredUsers.length;

        return acc;
      },
      {
        ...initialCounts,
      },
    ) || { ...initialCounts };

    if (currectAnswerCount !== 1)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "quiz options must contain a currect answer",
      );

    if (currectAnswerExplainationCount > 1)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "quiz options can contain maximum one answer explaination",
      );

    if (answeredUsersCount)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't answer when creating a quiz",
      );
  }

  return next();
});

/* static methods start ============================================= */
communityPostSchema.statics.isMyPost = async (
  communityPostId: string,
  channelId: string,
): Promise<boolean> => {
  const { channelId: postChannelId } =
    (await CommunityPostModel.findById(communityPostId).select(
      "channelId -_id",
    )) || {};

  if (!postChannelId)
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  return channelId === postChannelId?.toString();
};

communityPostSchema.statics.findPostById = async (
  communityPostId: string,
  channelId: string,
): Promise<unknown> => {
  try {
    const postDetails = await CommunityPostModel.findById(communityPostId);

    if (!postDetails)
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    const { isPublished } = postDetails;

    if (
      channelId &&
      !isPublished &&
      !(await CommunityPostModel.isMyPost(communityPostId, channelId))
    )
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    return postDetails;
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.isPublicPostById = async (
  communityPostId: string,
): Promise<boolean | unknown> => {
  try {
    const { isPublished } =
      (await CommunityPostModel.findById(communityPostId)) || {};
    return Boolean(isPublished);
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.createPost = async (
  payload: ICreateCommunityPost,
): Promise<unknown> => {
  try {
    return await CommunityPostModel.create({ ...payload });
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.updatePost = async (
  payload: Partial<ICreateCommunityPost>,
  postId: string,
): Promise<unknown> => {
  try {
    return await CommunityPostModel.findByIdAndUpdate(postId, { ...payload });
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.deletePost = async (
  communityPostId: string,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentModel.deleteAllCommentByPostId(
      communityPostId,
      "communityPost",
    );

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      communityPostId,
      "communityPost",
      session,
    );

    (result as unknown) = await CommentModel.findByIdAndDelete(
      communityPostId,
      {
        session,
      },
    );

    if (!result)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong",
      );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return errorHandler(error);
  }
};

/* static methods end ============================================= */

export const CommunityPostModel = model<ICommunityPost, ICommunityPostModel>(
  CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
  communityPostSchema,
);
