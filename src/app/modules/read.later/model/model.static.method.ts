import httpStatus from "http-status";
import { ReadLaterModel } from "./model";
import readLaterSchema from "./model.schema";
import { ClientSession } from "mongoose";
import AppError from "../../../errors/AppError";

readLaterSchema.statics.isMyReadLaterListPost = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<boolean | unknown> => {
  const readLaterPost = await ReadLaterModel.findById(id);

  if (!readLaterPost)
    throw new AppError(httpStatus.NOT_FOUND, "This item doesn't exist");

  return Boolean(readLaterPost?.userId?.toString() === userId);
};

readLaterSchema.statics.isExistInReadLaterList = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<boolean | unknown> => {
  return Boolean(
    await ReadLaterModel.findOne({
      postId,
      userId,
    }),
  );
};

readLaterSchema.statics.removeFromReadLaterListWhenPostIsDeleting = async ({
  postId,
  session,
}: {
  postId: string;
  session: ClientSession;
}) => {
  return await ReadLaterModel.deleteMany(
    { postId },
    { ...(session ? { session } : {}) },
  );
};
