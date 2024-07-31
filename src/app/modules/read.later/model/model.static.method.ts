import httpStatus from "http-status";
import { ReadLaterModel } from "./model";
import readLaterSchema from "./model.schema";
import { ClientSession } from "mongoose";
import AppError from "../../../errors/AppError";
import errorHandler from "../../../errors/errorHandler";

readLaterSchema.statics.isMyReadLaterListPost = async (
  id: string,
  userId: string,
): Promise<boolean | unknown> => {
  try {
    const readLaterPost = await ReadLaterModel.findById(id);

    if (!readLaterPost)
      throw new AppError(httpStatus.NOT_FOUND, "This item doesn't exist");

    return Boolean(readLaterPost?.userId?.toString() === userId);
  } catch (error) {
    return errorHandler(error);
  }
};

readLaterSchema.statics.isExistInReadLaterList = async (
  postId: string,
  userId: string,
): Promise<boolean | unknown> => {
  try {
    return Boolean(
      await ReadLaterModel.findOne({
        postId,
        userId,
      }),
    );
  } catch (error) {
    return errorHandler(error);
  }
};

readLaterSchema.statics.addToReadLaterList = async (
  postId: string,
  userId: string,
): Promise<unknown> => {
  try {
    return await ReadLaterModel.create({
      postId,
      userId,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

/*
 *
 *  removing post from my read later list
 *
 */
readLaterSchema.statics.removeFromReadLaterListById = async (
  id: string,
  userId: string,
): Promise<unknown> => {
  try {
    if (!(await ReadLaterModel.isMyReadLaterListPost(id, userId)))
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This is not your read later list item",
      );

    return await ReadLaterModel.findByIdAndDelete(id);
  } catch (error) {
    return errorHandler(error);
  }
};

/*
 *
 *  removing post from my read later list
 *
 */
readLaterSchema.statics.removeFromReadLaterList = async (
  postId: string,
  userId: string,
): Promise<unknown> => {
  try {
    const postData = await ReadLaterModel.findOne({ postId, userId });

    if (!postData)
      throw new AppError(
        httpStatus.NOT_FOUND,
        "this post is not in read later list",
      );

    if (
      !(await ReadLaterModel.isMyReadLaterListPost(
        postData?._id?.toString(),
        userId,
      ))
    )
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This is not your read later list item",
      );

    return await ReadLaterModel.deleteOne({ postId, userId });
  } catch (error) {
    return errorHandler(error);
  }
};

readLaterSchema.statics.removeFromReadLaterListWhenPostIsDeleting = async (
  postId: string,
  session: ClientSession,
) => {
  try {
    return await ReadLaterModel.deleteMany(
      { postId },
      { ...(session ? { session } : {}) },
    );
  } catch (error) {
    return errorHandler(error);
  }
};
