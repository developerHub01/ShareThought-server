import { model, Schema } from "mongoose";
import {
  ISearchHistory,
  ISearchHistoryModel,
} from "./search.history.interface";
import { SearchHistoryConstant } from "./search.history.constant";
import { UserConstant } from "../user/user.constant";
import errorHandler from "../../errors/errorHandler";

const searchHistorySchema = new Schema<ISearchHistory, ISearchHistoryModel>(
  {
    searchTerm: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    searchUserIdList: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: UserConstant.USER_COLLECTION_NAME,
          unique: true,
          trim: true,
        },
      ],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

searchHistorySchema.virtual("totalSearch").get(function () {
  return this.searchUserIdList?.length;
});

searchHistorySchema.statics.addToSearchList = async (
  searchTerm: string,
  userId: string,
): Promise<unknown> => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

export const SearchHistoryModel = model<ISearchHistory, ISearchHistoryModel>(
  SearchHistoryConstant.SEARCH_HISTORY_COLLECTION_NAME,
  searchHistorySchema,
);
