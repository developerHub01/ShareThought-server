import { model, Schema } from "mongoose";
import { PostReactionConstant } from "./post.reaction.constant";
import {
  IPostReaction,
  IPostReactionModel,
  TPostReactionType,
} from "./post.reaction.interface";
import errorHandler from "../../errors/errorHandler";

const postReactionSchema = new Schema<IPostReaction, IPostReactionModel>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reactionType: {
    type: String,
    enum: Object.values(PostReactionConstant.POST_REACTION_TYPE),
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
        reactionType: PostReactionConstant.POST_REACTION_TYPE.LIKE,
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
      { upsert: true },
    );
    return await PostReactionModel.findByIdAndUpdate(doc?._id, {
      reactionType,
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const PostReactionModel = model<IPostReaction, IPostReactionModel>(
  "PostReaction",
  postReactionSchema,
);
