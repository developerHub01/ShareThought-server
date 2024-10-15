import { ModeratorModel } from "./model";
import moderatorSchema from "./model.schema";

moderatorSchema.statics.getChannelModeratorsCount = async (
  channelId: string,
) => {
  return (await ModeratorModel.countDocuments({ channelId })) || 0;
};
