import { Schema } from "mongoose";
import { ICategory, ICategoryModel } from "../category.interface";
import { ChannelConstant } from "../../channel/channel.constant";
import { CategoryConstant } from "../category.constant";
import { PostConstant } from "../../post/post.constant";

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: CategoryConstant.CATEGORY_NAME_MIN_LENGTH,
      maxlength: CategoryConstant.CATEGORY_NAME_MAX_LENGTH,
    },
    description: {
      type: String,
      trim: true,
      minlength: CategoryConstant.CATEGORY_DESCRIPTION_MIN_LENGTH,
      maxlength: CategoryConstant.CATEGORY_DESCRIPTION_MAX_LENGTH,
    },
    thumbnails: {
      type: String,
      trim: true,
    },
    accessType: {
      type: String,
      enum: Object.values(CategoryConstant.CATEGORY_ACCESS_TYPE),
      default: CategoryConstant.CATEGORY_ACCESS_TYPE.PUBLIC,
    },
    postList: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: PostConstant.POST_COLLECTION_NAME,
        },
      ],
      default: [],
      minlength: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default categorySchema;
