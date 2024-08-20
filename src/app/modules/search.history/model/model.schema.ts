import { Schema } from "mongoose";
import {
  ISearchHistory,
  ISearchHistoryModel,
} from "../search.history.interface";
import { UserConstant } from "../../user/user.constant";

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
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  },
);

searchHistorySchema.virtual("totalSearch").get(function () {
  return this.searchUserIdList?.length;
});

export default searchHistorySchema;
