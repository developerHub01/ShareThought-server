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
import { PostModel } from "../post/post.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const postReactionSchema = new Schema<IPostReaction, IPostReactionModel>({
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
  reactionType: {
    type: String,
    enum: Object.values(PostReactionConstant.POST_REACTION_TYPES),
  },
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
  userId: string,
  postId: string,
): Promise<string | unknown> => {
  try {
    const result = await PostReactionModel.findOne({
      postId,
      userId,
    });

    return result?.reactionType || null;
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.togglePostReaction = async (
  userId: string,
  postId: string,
): Promise<boolean | unknown> => {
  try {
    const isDeleted = await PostReactionModel.findOneAndDelete({ postId });

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await PostReactionModel.create({
        postId,
        userId,
        reactionType: PostReactionConstant.POST_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.reactOnPost = async (
  userId: string,
  postId: string,
  reactionType: TPostReactionType,
): Promise<unknown> => {
  try {
    const doc = await PostReactionModel.findOneAndUpdate(
      {
        userId,
        postId,
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
  userId: string,
  postId: string,
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  try {
    if (!(await PostModel.isMyPost(postId, userId)))
      throw new AppError(httpStatus.UNAUTHORIZED, "This is not your post");

    return await PostReactionModel.deleteMany({ postId }, options);
  } catch (error) {
    return errorHandler(error);
  }
};

export const PostReactionModel = model<IPostReaction, IPostReactionModel>(
  PostReactionConstant.POST_REACTION_COLLECTION_NAME,
  postReactionSchema,
);
