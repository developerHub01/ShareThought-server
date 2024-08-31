import historySettingSchema from "./setting.model.schema";
import { HistorySettingModel } from "./setting.model";

historySettingSchema.statics.createHistorySetting = async (
  userId: string,
): Promise<unknown> => {
  if (await HistorySettingModel.findOne({ userId })) return;

  return await HistorySettingModel.create({ userId });
};

historySettingSchema.statics.isMyHistoryActive = async (
  userId: string,
): Promise<boolean | unknown> => {
  return Boolean(await HistorySettingModel.findOne({ userId }));
};

historySettingSchema.statics.toggleHistoryActivity = async (
  userId: string,
): Promise<unknown> => {
  const isActive = await HistorySettingModel.isMyHistoryActive(userId);

  return await HistorySettingModel.updateOne(
    { userId },
    { isHistoryActive: !isActive },
    { new: false },
  );
};
