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
import { ICreatePost } from "../post.interface";
import { TagModel } from "../../tags/model/model";
import { ITag } from "../../tags/tags.interface";

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

/* check is a post is mine or not */
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

/* find single post by id */
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

/* is public post check by id */
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

/* create post */
postSchema.statics.createPost = async (payload: ICreatePost) => {
  try {
    // eslint-disable-next-line prefer-const
    let { tags } = payload;

    try {
      if (tags) {
        (tags as unknown as Array<ITag>) = tags.map((tag: string) => ({
          _id: tag,
        }));

        await TagModel.insertMany(tags, {
          ordered: false,
        });
        /* 
          {ordered:false} because if any of the tag exist in tag collection then ingnore it instead of stoping the process 
        */
      }
    } catch (error) {
      /*  */
    }

    tags = payload.tags;

    return await PostModel.create({
      ...payload,
    });
  } catch (error) {
    errorHandler(error);
  }
};

/* update post */
postSchema.statics.updatePost = async (payload: Partial<ICreatePost>, postId: string) => {
  try {
    // eslint-disable-next-line prefer-const
    let { tags } = payload;
    
    try {
      if (tags) {
        (tags as unknown as Array<ITag>) = tags.map((tag: string) => ({
          _id: tag,
        }));

        await TagModel.insertMany(tags, {
          ordered: false,
        });
        /* 
          {ordered:false} because if any of the tag exist in tag collection then ingnore it instead of stoping the process 
        */
      }
    } catch (error) {
      /*  */
    }

    return await PostModel.findByIdAndUpdate(
      postId,
      { ...payload },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
};

/* delete a post with dependencies */
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

