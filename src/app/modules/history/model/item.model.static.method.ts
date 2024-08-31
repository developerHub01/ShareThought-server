import httpStatus from "http-status";
import historyItemSchema from "./item.mode.schema";
import { HistoryItemModel } from "./item.model";
import { HistorySettingModel } from "./setting.model";
import AppError from "../../../errors/AppError";

historyItemSchema.statics.addPostInHistory = async (
  postId: string,
  userId: string,
): Promise<unknown> => {
  await HistorySettingModel.createHistorySetting(userId);

  let isDeleted = false;

  if (!(await HistorySettingModel.isMyHistoryActive(userId))) isDeleted = true;

  const historyData = await HistoryItemModel.create({
    postId,
    userId,
    isDeleted,
  });

  if (isDeleted)
    throw new AppError(httpStatus.BAD_REQUEST, "Your history is paused");

  return historyData;
};

historyItemSchema.statics.removePostFromHistory = async (
  historyItemId: string,
  userId: string,
): Promise<unknown> => {
  await HistorySettingModel.createHistorySetting(userId);

  return await HistorySettingModel.findByIdAndUpdate(
    historyItemId,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
};

historyItemSchema.statics.clearPostFromHistory = async (
  userId: string,
): Promise<unknown> => {
  await HistorySettingModel.createHistorySetting(userId);

  return await HistorySettingModel.updateMany(
    { userId },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
};
