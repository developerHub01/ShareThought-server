import { model, Schema } from "mongoose";
import { HistoryConstant } from "./history.constant";
import errorHandler from "../../errors/errorHandler";
import { UserConstant } from "../user/user.constant";
import { PostConstant } from "../post/post.constant";
import { IHistoryItem, IHistoryItemModel } from "./history.item.interface";
import { HistorySettingModel } from "./history.setting.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const historyItemSchema = new Schema<IHistoryItem, IHistoryItemModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

historyItemSchema.statics.addPostInHistory = async (
  postId: string,
  userId: string,
): Promise<unknown> => {
  try {
    await HistorySettingModel.createHistorySetting(userId);

    if (!(await HistorySettingModel.isMyHistoryActive(userId)))
      throw new AppError(httpStatus.BAD_REQUEST, "Your history is paused");

    return await HistoryItemModel.create({
      postId,
      userId,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

historyItemSchema.statics.removePostFromHistory = async (
  historyItemId: string,
  userId: string,
): Promise<unknown> => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

historyItemSchema.statics.clearPostFromHistory = async (
  userId: string,
): Promise<unknown> => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

export const HistoryItemModel = model<IHistoryItem, IHistoryItemModel>(
  HistoryConstant.HISTORY_ITEM_COLLECTION_NAME,
  historyItemSchema,
);
