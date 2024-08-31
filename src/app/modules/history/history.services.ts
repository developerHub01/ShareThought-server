import QueryBuilder from "../../builder/QueryBuilder";
import { HistoryConstant } from "./history.constant";
import { HistoryItemModel } from "./model/item.model";
import { HistorySettingModel } from "./model/setting.model";

const findHistoryItem = async (
  query: Record<string, unknown>,
  userId: string,
) => {
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
};

const isMyHistoryActive = async (userId: string) => {
  return await HistorySettingModel.isMyHistoryActive(userId);
};

const toggleHistoryActivity = async (userId: string) => {
  return await HistorySettingModel.toggleHistoryActivity(userId);
};

const addPostInHistory = async (postId: string, userId: string) => {
  return await HistoryItemModel.addPostInHistory(postId, userId);
};

const removePostFromHistory = async (historyItemId: string, userId: string) => {
  return await HistoryItemModel.removePostFromHistory(historyItemId, userId);
};

const clearPostFromHistory = async (userId: string) => {
  return await HistoryItemModel.clearPostFromHistory(userId);
};

export const HistoryServices = {
  findHistoryItem,
  isMyHistoryActive,
  toggleHistoryActivity,
  addPostInHistory,
  removePostFromHistory,
  clearPostFromHistory,
};
