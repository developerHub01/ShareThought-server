import mongoose, { model, Schema } from "mongoose";
import { PostConstant } from "./post.constant";
import { IPost, IPostModel } from "./post.interface";
import { ChannelConstant } from "../channel/channel.constant";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { CommentModel } from "../comment/comment.model";
// import { PostReactionModel } from "../post.reaction/post.reaction.model";

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
  },
  {
    timestamps: true,
  },
);

postSchema.statics.isMyPost = async (
  postId: string,
  userId: string,
): Promise<boolean> => {
  const collectionChain = (await PostModel.findById(postId)
    .select("channelId -_id")
    .populate({
      path: "channelId",
      select: "authorId -_id",
      populate: {
        path: "authorId",
        select: "_id",
      },
    })) as unknown as { channelId: { authorId: { _id: string } } };

  const result = collectionChain?.channelId?.authorId?._id?.toString();

  return userId === result;
};

postSchema.statics.findPostById = async (
  id: string,
  userId?: string,
): Promise<unknown> => {
  try {
    const postDetails = await PostModel.findById(id);

    if (!postDetails)
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    const { isPublished } = postDetails;

    if (userId && !isPublished && !(await PostModel.isMyPost(id, userId)))
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
  userId: string,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (!(await PostModel.isMyPost(postId, userId)))
      throw new AppError(httpStatus.UNAUTHORIZED, "This is not your post..");

    let result = await CommentModel.deleteAllCommentByPostId(postId, userId);

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
