import { ClientSession, model, Schema } from "mongoose";
import {
  ICommentReaction,
  ICommentReactionModel,
  TCommentReactionType,
} from "./comment.reaction.interface";
import { CommentReactionConstant } from "./comment.reaction.constant";
import { CommentConstant } from "../comment/comment.constant";
import { UserConstant } from "../user/user.constant";
import errorHandler from "../../errors/errorHandler";

const commentReactionSchema = new Schema<
  ICommentReaction,
  ICommentReactionModel
>({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: CommentConstant.COMMENT_COLLECTION_NAME,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: UserConstant.USER_COLLECTION_NAME,
    required: true,
  },
  reactionType: {
    type: String,
    enum: Object.values(CommentReactionConstant.COMMENT_REACTION_TYPES),
  },
});

commentReactionSchema.statics.totalCommentReactionByCommentId = async (
  commentId: string,
): Promise<unknown> => {
  try {
    return (await CommentReactionModel.countDocuments({ commentId })) || 0;
  } catch (error) {
    errorHandler(error);
  }
};

commentReactionSchema.statics.myReactionOnComment = async (
  userId: string,
  commentId: string,
): Promise<string | unknown> => {
  try {
    const result = await CommentReactionModel.findOne({
      commentId,
      userId,
    });

    return result?.reactionType || null;
  } catch (error) {
    errorHandler(error);
  }
};

commentReactionSchema.statics.deleteCommentReactionByCommentId = async (
  commentId: string,
  session: ClientSession,
): Promise<unknown> => {
  const options = session ? { session } : {};
  try {
    return await CommentReactionModel.findOneAndDelete(
      {
        commentId,
      },
      { options },
    );
  } catch (error) {
    return errorHandler(error);
  }
};

commentReactionSchema.statics.toggleCommentReaction = async (
  userId: string,
  commentId: string,
): Promise<boolean | unknown> => {
  try {
    const isDeleted = await CommentReactionModel.findOneAndDelete({
      commentId,
      userId,
    });

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await CommentReactionModel.create({
        commentId,
        userId,
        reactionType: CommentReactionConstant.COMMENT_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

commentReactionSchema.statics.reactOnComment = async (
  userId: string,
  commentId: string,
  reactionType: TCommentReactionType,
): Promise<unknown> => {
  try {
    const doc = await CommentReactionModel.findOneAndUpdate(
      {
        userId,
        commentId,
      },
      { upsert: true },
    );
    return await CommentReactionModel.findByIdAndUpdate(doc?._id, {
      reactionType,
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const CommentReactionModel = model<
  ICommentReaction,
  ICommentReactionModel
>(
  CommentReactionConstant.COMMENT_REACTION_COLLECTION_NAME,
  commentReactionSchema,
);
