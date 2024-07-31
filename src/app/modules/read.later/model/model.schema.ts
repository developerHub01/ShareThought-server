import { Schema } from "mongoose";
import { IReadLater, IReadLaterModel } from "../read.later.interface";
import { PostConstant } from "../../post/post.constant";
import { UserConstant } from "../../user/user.constant";

const readLaterSchema = new Schema<IReadLater, IReadLaterModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export default readLaterSchema;
