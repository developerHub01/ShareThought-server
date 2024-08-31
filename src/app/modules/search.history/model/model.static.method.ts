import { SearchHistoryModel } from "./model";
import searchHistorySchema from "./model.schema";

searchHistorySchema.statics.addToSearchList = async (
  searchTerm: string,
  userId: string,
): Promise<unknown> => {
  return await SearchHistoryModel.findOneAndUpdate(
    { searchTerm },
    {
      searchTerm,
      $addToSet: {
        ...(userId && { searchUserIdList: userId }),
      },
    },
    { upsert: true, new: true },
  );
};
