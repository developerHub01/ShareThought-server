import { Schema } from "mongoose";
import {
  IHistorySetting,
  IHistorySettingModel,
} from "../history.setting.interface";
import { UserConstant } from "../../user/user.constant";

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
    userType: {
      type: String,
      enum: ["guest", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default historySettingSchema;
