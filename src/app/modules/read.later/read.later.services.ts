import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { ReadLaterConstant } from "./read.later.constant";
import { ReadLaterModel } from "./read.later.model";

const findReadLaterList = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

const isExistInReadLaterList = async (postId: string, userId: string) => {
  try {
    return await ReadLaterModel.isExistInReadLaterList(postId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const addToReadLaterList = async (postId: string, userId: string) => {
  try {
    return await ReadLaterModel.addToReadLaterList(postId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const removeFromReadLaterListById = async (id: string, userId: string) => {
  try {
    return await ReadLaterModel.removeFromReadLaterListById(id, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const removeFromReadLaterList = async (postId: string, userId: string) => {
  try {
    return await ReadLaterModel.removeFromReadLaterList(postId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

export const ReadLaterServices = {
  findReadLaterList,
  isExistInReadLaterList,
  addToReadLaterList,
  removeFromReadLaterList,
  removeFromReadLaterListById,
};
