import httpStatus from "http-status";
import { ReadLaterModel } from "./model";
import readLaterSchema from "./model.schema";
import { ClientSession } from "mongoose";
import AppError from "../../../errors/AppError";

readLaterSchema.statics.isMyReadLaterListPost = async (
  id: string,
  userId: string,
): Promise<boolean | unknown> => {
  const readLaterPost = await ReadLaterModel.findById(id);

  if (!readLaterPost)
    throw new AppError(httpStatus.NOT_FOUND, "This item doesn't exist");

  return Boolean(readLaterPost?.userId?.toString() === userId);
};

readLaterSchema.statics.isExistInReadLaterList = async (
  postId: string,
  userId: string,
): Promise<boolean | unknown> => {
  return Boolean(
    await ReadLaterModel.findOne({
      postId,
      userId,
    }),
  );
};

readLaterSchema.statics.addToReadLaterList = async (
  postId: string,
  userId: string,
): Promise<unknown> => {
  return await ReadLaterModel.create({
    postId,
    userId,
  });
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
  if (!(await ReadLaterModel.isMyReadLaterListPost(id, userId)))
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your read later list item",
    );

  return await ReadLaterModel.findByIdAndDelete(id);
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
};

readLaterSchema.statics.removeFromReadLaterListWhenPostIsDeleting = async (
  postId: string,
  session: ClientSession,
) => {
  return await ReadLaterModel.deleteMany(
    { postId },
    { ...(session ? { session } : {}) },
  );
};
