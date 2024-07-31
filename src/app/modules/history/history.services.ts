import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { HistoryConstant } from "./history.constant";
import { HistoryItemModel } from "./history.item.model";
import { HistorySettingModel } from "./history.setting.model";

const findHistoryItem = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  try {
    const historyQuery = new QueryBuilder(
      HistoryItemModel.find({
        userId,
        isDeleted: false,
      }).populate({
        path: "postId",
        select: "title banner publishedAt channelId isPublished",
        match: {
          isPublished: true,
        },
        populate: {
          path: "channelId",
          select: "channelName channelAvatar",
        },
      }),
      query,
    )
      .search(HistoryConstant.HISTORY_POST_SEARCHABLE_FIELD)
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await historyQuery.countTotal();
    const result = await historyQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const isMyHistoryActive = async (userId: string) => {
  try {
    return await HistorySettingModel.isMyHistoryActive(userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const toggleHistoryActivity = async (userId: string) => {
  try {
    return await HistorySettingModel.toggleHistoryActivity(userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const addPostInHistory = async (postId: string, userId: string) => {
  try {
    return await HistoryItemModel.addPostInHistory(postId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const removePostFromHistory = async (historyItemId: string, userId: string) => {
  try {
    return await HistoryItemModel.removePostFromHistory(historyItemId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const clearPostFromHistory = async (userId: string) => {
  try {
    return await HistoryItemModel.clearPostFromHistory(userId);
  } catch (error) {
    return errorHandler(error);
  }
};

export const HistoryServices = {
  findHistoryItem,
  isMyHistoryActive,
  toggleHistoryActivity,
  addPostInHistory,
  removePostFromHistory,
  clearPostFromHistory,
};
