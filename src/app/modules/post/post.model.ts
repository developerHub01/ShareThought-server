import { model, Schema } from "mongoose";
import { PostConstant } from "./post.constant";
import { IPost, IPostModel } from "./post.interface";

const postSchema = new Schema<IPost, IPostModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
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
    // tags: {
    //   type: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: "Tag",
    //     },
    //   ],
    //   validate: [
    //     (tags: Array<Schema.Types.ObjectId>) =>
    //       tags.length <= PostConstant.POST_TAGS_MAX_NUMBER,
    //     `{PATH} exceeds the limit of ${PostConstant.POST_TAGS_MAX_NUMBER}`,
    //   ],
    // },
  },
  {
    timestamps: true,
  },
);

postSchema.statics.isMyPost = async (
  postId: string,
  userId: string,
): Promise<boolean> => {
  const collectionChain = (await PostModel.findById(postId)
    .select("channelId -_id")
    .populate({
      path: "channelId",
      select: "authorId -_id",
      populate: {
        path: "authorId",
        select: "_id",
      },
    })) as unknown as { channelId: { authorId: { _id: string } } };

  const result = collectionChain?.channelId?.authorId?._id.toString();

  return userId === result;
};

export const PostModel = model<IPost, IPostModel>("Post", postSchema);
