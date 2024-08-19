import mongoose from "mongoose";
import httpStatus from "http-status";
import { PostModel } from "./model";
import postSchema from "./model.schema";
import AppError from "../../../errors/AppError";
import errorHandler from "../../../errors/errorHandler";
import { CommentModel } from "../../comment/model/model";
import { CategoryModel } from "../../category/model/model";
import { PostReactionModel } from "../../post.reaction/model/model";
import { ReadLaterModel } from "../../read.later/model/model";

postSchema.statics.isPostOfMyAnyChannel = async (
  userId: string,
  postId: string,
): Promise<boolean> => {
  const postData = await PostModel.findById(postId, "channelId").populate({
    path: "channelId",
    select: "authorId -_id",
  });

  if (!postData || !postData?.channelId) return false;

  const {
    channelId: { authorId },
  } = postData as unknown as { channelId: { authorId: string } };

  return userId === authorId?.toString();
};

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

postSchema.statics.deletePost = async (postId: string): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentModel.deleteAllCommentByPostId(
      postId,
      "blogPost",
    );

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      postId,
      "blogPost",
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
