import { Schema } from "mongoose";
import { IPost, IPostModel } from "../post.interface";
import { ChannelConstant } from "../../channel/channel.constant";
import { PostConstant } from "../post.constant";

const postSchema = new Schema<IPost, IPostModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
      required: true,
    },
    title: {
      type: String,
      minLength: PostConstant.POST_TITLE_MIN_LENGTH,
      maxLength: PostConstant.POST_TITLE_MAX_LENGTH,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      minLength: PostConstant.POST_CONTENT_MIN_LENGTH,
      maxLength: PostConstant.POST_CONTENT_MAX_LENGTH,
      trim: true,
      required: true,
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    banner: {
      type: String,
      trim: true,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    scheduledTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default postSchema;
