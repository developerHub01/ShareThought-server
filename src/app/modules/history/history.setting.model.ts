import { model, Schema } from "mongoose";
import { HistoryConstant } from "./history.constant";
import {
  IHistorySetting,
  IHistorySettingModel,
} from "./history.setting.interface";
import errorHandler from "../../errors/errorHandler";
import { UserConstant } from "../user/user.constant";

const historySettingSchema = new Schema<IHistorySetting, IHistorySettingModel>(
  {
    isHistoryActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

historySettingSchema.statics.createHistorySetting = async (
  userId: string,
): Promise<unknown> => {
  try {
    if (await HistorySettingModel.findOne({ userId })) return;

    return await HistorySettingModel.create({ userId });
  } catch (error) {
    return errorHandler(error);
  }
};

historySettingSchema.statics.isMyHistoryActive = async (
  userId: string,
): Promise<boolean | unknown> => {
  try {
    return Boolean(await HistorySettingModel.findOne({ userId }));
  } catch (error) {
    return errorHandler(error);
  }
};

historySettingSchema.statics.toggleHistoryActivity = async (
  userId: string,
): Promise<unknown> => {
  try {
    const isActive = await HistorySettingModel.isMyHistoryActive(userId);

    return await HistorySettingModel.updateOne(
      { userId },
      { isHistoryActive: !isActive },
      { new: false },
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const HistorySettingModel = model<IHistorySetting, IHistorySettingModel>(
  HistoryConstant.HISTORY_SETTING_COLLECTION_NAME,
  historySettingSchema,
);
