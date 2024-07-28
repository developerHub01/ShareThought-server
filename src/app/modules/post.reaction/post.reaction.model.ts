import { ClientSession, model, Schema } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";
import {
  IPostReaction,
  IPostReactionModel,
  TPostReactionType,
} from "./post.reaction.interface";
import errorHandler from "../../errors/errorHandler";
import { PostConstant } from "../post/post.constant";
import { UserConstant } from "../user/user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ChannelConstant } from "../channel/channel.constant";
import { CommunityConstant } from "../community/community.constant";
import { TAuthorType, TPostType } from "../../interface/interface";

const postReactionSchema = new Schema<IPostReaction, IPostReactionModel>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: PostConstant.POST_COLLECTION_NAME,
  },
  communityPostId: {
    type: Schema.Types.ObjectId,
    ref: CommunityConstant.COMMUNITY_COLLECTION_NAME,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: UserConstant.USER_COLLECTION_NAME,
  },
  channelId: {
    type: Schema.Types.ObjectId,
    ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
  },
  reactionType: {
    type: String,
    enum: Object.values(PostReactionConstant.POST_REACTION_TYPES),
  },
});

postReactionSchema.pre("save", async function (next) {
  if (!(this.postId || this.communityPostId))
    throw new AppError(httpStatus.BAD_REQUEST, "post id is required");

  if (!this.userId && !this.channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "author data not exist");

  next();
});

postReactionSchema.statics.totalPostReactionByPostId = async (
  postId: string,
  postType: TPostType,
): Promise<unknown> => {
  try {
    return (
      (await PostReactionModel.countDocuments({
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      })) || 0
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.myReactionOnPost = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<string | unknown> => {
  try {
    const result = await PostReactionModel.findOne({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    });

    return result?.reactionType || null;
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.togglePostReaction = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<boolean | unknown> => {
  try {
    const query = {
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    };
    const isDeleted = await PostReactionModel.findOneAndDelete(query);

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await PostReactionModel.create({
        ...query,
        reactionType: PostReactionConstant.POST_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.reactOnPost = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
  reactionType: TPostReactionType,
): Promise<unknown> => {
  try {
    const doc = await PostReactionModel.findOneAndUpdate(
      {
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
        ...(authorIdType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
      },
      { upsert: true, new: true },
    );

    return await PostReactionModel.findByIdAndUpdate(
      doc?._id,
      {
        reactionType,
      },
      {
        new: true,
      },
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.deleteAllReactionByPostId = async (
  postId: string,
  postType: TPostType,
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  try {
    return await PostReactionModel.deleteMany(
      {
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      },
      options,
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const PostReactionModel = model<IPostReaction, IPostReactionModel>(
  PostReactionConstant.POST_REACTION_COLLECTION_NAME,
  postReactionSchema,
);
