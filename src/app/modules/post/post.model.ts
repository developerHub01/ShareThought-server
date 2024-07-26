import mongoose, { model, Schema } from "mongoose";
import { PostConstant } from "./post.constant";
import { IPost, IPostModel } from "./post.interface";
import { ChannelConstant } from "../channel/channel.constant";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { CommentModel } from "../comment/comment.model";
import { PostReactionModel } from "../post.reaction/post.reaction.model";
import { ReadLaterModel } from "../read.later/read.later.model";
import { CategoryModel } from "../category/category.model";
import { PostSchedule } from "./post.schedule";

const postSchema = new Schema<IPost, IPostModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
      required: true,
    },
    title: {
      type: String,
      minLength: PostConstant.POST_TITLE_MIN_LENGTH,
      maxLength: PostConstant.POST_TITLE_MAX_LENGTH,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      minLength: PostConstant.POST_CONTENT_MIN_LENGTH,
      maxLength: PostConstant.POST_CONTENT_MAX_LENGTH,
      trim: true,
      required: true,
    },
    banner: {
      type: String,
      trim: true,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    scheduledTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.pre<IPost>("save", async function (next) {
  if (this.isPublished) {
    this.publishedAt = new Date();
    return next();
  }

  if (!this.scheduledTime) return next();

  let currentTime = new Date();
  currentTime.setSeconds(0, 0);
  (currentTime as unknown) = currentTime?.getTime();

  let scheduledTime = new Date(this?.scheduledTime);
  scheduledTime?.setSeconds(0, 0);
  (scheduledTime as unknown) = scheduledTime?.getTime();

  /* if schedule date was past */
  if (scheduledTime && scheduledTime <= currentTime) {
    this.publishedAt = new Date();
    this.isPublished = true;
    this.scheduledTime = undefined;
    return next();
  }

  next();
});

/* handle schedule after saving post */
postSchema.post<IPost>("save", async function (doc) {
  if (!doc.isPublished && doc.scheduledTime) {
    await PostSchedule.handleSetPostSchedule(
      doc.scheduledTime,
      (doc as typeof doc & { _id: string })?._id?.toString(),
    );
  }
});

/* handle schedule when updating post */
postSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  const updatedData: Partial<typeof update> = {};

  const { isPublished, publishedAt } = update as typeof update & {
    isPublished?: boolean;
    publishedAt?: Date;
  };
  let { scheduledTime } = update as typeof update & {
    scheduledTime: Date;
  };

  let currentTime = new Date();
  currentTime.setSeconds(0, 0);
  (currentTime as unknown) = currentTime?.getTime();

  if (scheduledTime) {
    scheduledTime = new Date(scheduledTime);
    scheduledTime?.setSeconds(0, 0);
    (scheduledTime as unknown) = scheduledTime?.getTime();
  }

  if (isPublished) updatedData.scheduledTime = undefined;
  else if (scheduledTime && scheduledTime <= currentTime) {
    if (!publishedAt) updatedData.publishedAt = new Date();
    updatedData.isPublished = true;
    updatedData.scheduledTime = undefined;
  } else {
    updatedData.isPublished = false;
    await PostSchedule.handleSetPostSchedule(
      scheduledTime,
      (update as typeof update & { _id: string })?._id?.toString(),
    );
  }

  this.setUpdate({ ...update, ...updatedData });
});

postSchema.statics.isMyPost = async (
  postId: string,
  channelId: string,
): Promise<boolean> => {
  const { channelId: postChannelId } =
    (await PostModel.findById(postId).select("channelId -_id")) || {};

  if (!postChannelId)
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  return channelId === postChannelId?.toString();
};

postSchema.statics.findPostById = async (
  id: string,
  channelId: string,
): Promise<unknown> => {
  try {
    const postDetails = await PostModel.findById(id);

    if (!postDetails)
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    const { isPublished } = postDetails;

    if (channelId && !isPublished && !(await PostModel.isMyPost(id, channelId)))
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    return postDetails;
  } catch (error) {
    return errorHandler(error);
  }
};

postSchema.statics.isPublicPostById = async (
  id: string,
): Promise<boolean | unknown> => {
  try {
    const { isPublished } = (await PostModel.findById(id)) || {};
    return Boolean(isPublished);
  } catch (error) {
    return errorHandler(error);
  }
};

postSchema.statics.deletePost = async (
  postId: string,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentModel.deleteAllCommentByPostId(postId);

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      postId,
      session,
    );

    /* removing post from all category postList */
    (result as unknown) =
      await CategoryModel.removeSpecificPostFromAllCategoryList(
        postId,
        session,
      );

    /* Deleting all that post from all read later list */
    (result as unknown) =
      await ReadLaterModel.removeFromReadLaterListWhenPostIsDeleting(
        postId,
        session,
      );

    (result as unknown) = await PostModel.findByIdAndDelete(postId, {
      session,
    });

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

export const PostModel = model<IPost, IPostModel>(
  PostConstant.POST_COLLECTION_NAME,
  postSchema,
);
