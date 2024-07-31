import { ClientSession } from "mongoose";
import errorHandler from "../../../errors/errorHandler";
import { TAuthorType } from "../../../interface/interface";
import { CommentReactionModel } from "./model";
import { CommentReactionConstant } from "../comment.reaction.constant";
import { TCommentReactionType } from "../comment.reaction.interface";
import commentReactionSchema from "./model.schema";

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
  authorIdType: TAuthorType,
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
  try {
    return await CommentReactionModel.findOneAndDelete(
      {
        commentId,
      },
      session ? { session } : {},
    );
  } catch (error) {
    return errorHandler(error);
  }
};

commentReactionSchema.statics.toggleCommentReaction = async (
  commentId: string,
  authorId: string,
  authorIdType: TAuthorType,
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
  authorIdType: TAuthorType,
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
