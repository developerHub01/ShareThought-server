import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CommunityPostModel } from "./community.post.model";
import errorHandler from "../../errors/errorHandler";
import { CommentModel } from "../comment/comment.model";
import { PostReactionModel } from "../post.reaction/post.reaction.model";
import mongoose from "mongoose";
import { ICreateCommunityPost } from "./community.post.interface";
import { communityPostSchema } from "./community.post.model.schema";

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
    return await CommunityPostModel.findByIdAndUpdate(
      postId,
      { ...payload },
      { new: true },
    );
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
