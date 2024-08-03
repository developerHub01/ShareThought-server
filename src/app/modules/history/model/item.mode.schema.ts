import { Schema } from "mongoose";
import { IHistoryItem, IHistoryItemModel } from "../history.item.interface";
import { PostConstant } from "../../post/post.constant";
import { UserConstant } from "../../user/user.constant";

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
    userType: {
      type: String,
      enum: ["guest", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default historyItemSchema;
