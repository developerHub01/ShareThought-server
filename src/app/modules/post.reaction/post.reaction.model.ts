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

const postReactionSchema = new Schema<IPostReaction, IPostReactionModel>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: PostConstant.POST_COLLECTION_NAME,
    required: true,
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
  if (!this.userId && !this.channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "author data not exist");

  next();
});

postReactionSchema.statics.totalPostReactionByPostId = async (
  postId: string,
): Promise<unknown> => {
  try {
    return (await PostReactionModel.countDocuments({ postId })) || 0;
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.myReactionOnPost = async (
  postId: string,
  authorId: string,
  authorIdType: "userId" | "channelId",
): Promise<string | unknown> => {
  try {
    const result = await PostReactionModel.findOne({
      postId,
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
  authorId: string,
  authorIdType: "userId" | "channelId",
): Promise<boolean | unknown> => {
  try {
    const isDeleted = await PostReactionModel.findOneAndDelete({
      postId,
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    });

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await PostReactionModel.create({
        postId,
        ...(authorIdType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
        reactionType: PostReactionConstant.POST_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.reactOnPost = async (
  postId: string,
  authorId: string,
  authorIdType: "userId" | "channelId",
  reactionType: TPostReactionType,
): Promise<unknown> => {
  try {
    const doc = await PostReactionModel.findOneAndUpdate(
      {
        postId,
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
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  try {
    return await PostReactionModel.deleteMany(
      {
        postId,
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
