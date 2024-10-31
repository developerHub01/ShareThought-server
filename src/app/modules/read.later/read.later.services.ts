import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ReadLaterModel } from "./model/model";
import { ReadLaterConstant } from "./read.later.constant";

const findReadLaterList = async ({
  query,
  userId,
}: {
  query: Record<string, unknown>;
  userId: string;
}) => {
  const readLaterQuery = new QueryBuilder(
    ReadLaterModel.find({
      userId,
    }).populate({
      path: "postId",
      match: {
        isPublished: true,
      },
      select: "-content",
      populate: {
        path: "channelId",
        select: "channelName channelCover",
      },
    }),
    query,
  )
    .search(ReadLaterConstant.READ_LATER_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await readLaterQuery.countTotal();
  const result = await readLaterQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const isExistInReadLaterList = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  return await ReadLaterModel.isExistInReadLaterList({ postId, userId });
};

const addToReadLaterList = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  return await ReadLaterModel.create({
    postId,
    userId,
  });
};

const removeFromReadLaterListById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  if (!(await ReadLaterModel.isMyReadLaterListPost({ id, userId })))
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your read later list item",
    );

  return await ReadLaterModel.findByIdAndDelete(id);
};

const removeFromReadLaterList = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const postData = await ReadLaterModel.findOne({ postId, userId });

  if (!postData)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "this post is not in read later list",
    );

  if (
    !(await ReadLaterModel.isMyReadLaterListPost({
      id: postData?._id?.toString(),
      userId,
    }))
  )
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your read later list item",
    );

  return await ReadLaterModel.deleteOne({ postId, userId });
};

export const ReadLaterServices = {
  findReadLaterList,
  isExistInReadLaterList,
  addToReadLaterList,
  removeFromReadLaterList,
  removeFromReadLaterListById,
};
