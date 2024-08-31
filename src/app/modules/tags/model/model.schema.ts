import { Schema } from "mongoose";
import { ITag, ITagModel } from "../tags.interface";
import { PostConstant } from "../../post/post.constant";

const tagSchema = new Schema<ITag, ITagModel>(
  {
    tag: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
      required: true,
    }
  },
  {
    versionKey: false,
  },
);

export default tagSchema;
