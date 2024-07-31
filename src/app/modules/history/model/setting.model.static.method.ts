import errorHandler from "../../../errors/errorHandler";
import historySettingSchema from "./setting.method.schema";
import { HistorySettingModel } from "./setting.model";

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
