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
import { ChannelConstant } from "../channel/channel.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

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
  },
  channelId: {
    type: Schema.Types.ObjectId,
    ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
  },
  reactionType: {
    type: String,
    enum: Object.values(CommentReactionConstant.COMMENT_REACTION_TYPES),
  },
});

commentReactionSchema.pre("save", async function (next) {
  if (!this.userId && !this.channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "author data not exist");

  next();
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
  commentId: string,
  authorId: string,
  authorIdType: "userId" | "channelId",
): Promise<string | unknown> => {
  try {
    const result = await CommentReactionModel.findOne({
      commentId,
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
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
  commentId: string,
  authorId: string,
  authorIdType: "userId" | "channelId",
): Promise<boolean | unknown> => {
  try {
    const isDeleted = await CommentReactionModel.findOneAndDelete({
      commentId,
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    });

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await CommentReactionModel.create({
        commentId,
        ...(authorIdType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
        reactionType: CommentReactionConstant.COMMENT_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

commentReactionSchema.statics.reactOnComment = async (
  commentId: string,
  authorId: string,
  authorIdType: "userId" | "channelId",
  reactionType: TCommentReactionType,
): Promise<unknown> => {
  try {
    const doc = await CommentReactionModel.findOneAndUpdate(
      {
        commentId,
        ...(authorIdType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
      },
      { upsert: true, new: true },
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
