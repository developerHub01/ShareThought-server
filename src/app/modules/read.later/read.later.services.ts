import QueryBuilder from "../../builder/QueryBuilder";
import { ReadLaterModel } from "./model/model";
import { ReadLaterConstant } from "./read.later.constant";

const findReadLaterList = async (
  query: Record<string, unknown>,
  userId: string,
) => {
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

const isExistInReadLaterList = async (postId: string, userId: string) => {
  return await ReadLaterModel.isExistInReadLaterList(postId, userId);
};

const addToReadLaterList = async (postId: string, userId: string) => {
  return await ReadLaterModel.addToReadLaterList(postId, userId);
};

const removeFromReadLaterListById = async (id: string, userId: string) => {
  return await ReadLaterModel.removeFromReadLaterListById(id, userId);
};

const removeFromReadLaterList = async (postId: string, userId: string) => {
  return await ReadLaterModel.removeFromReadLaterList(postId, userId);
};

export const ReadLaterServices = {
  findReadLaterList,
  isExistInReadLaterList,
  addToReadLaterList,
  removeFromReadLaterList,
  removeFromReadLaterListById,
};
