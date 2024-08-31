import { ClientSession } from "mongoose";
import { TAuthorType } from "../../../interface/interface";
import { CommentReactionModel } from "./model";
import { CommentReactionConstant } from "../comment.reaction.constant";
import { TCommentReactionType } from "../comment.reaction.interface";
import commentReactionSchema from "./model.schema";

commentReactionSchema.statics.totalCommentReactionByCommentId = async (
  commentId: string,
): Promise<number> => {
  return (await CommentReactionModel.countDocuments({ commentId })) || 0;
};

commentReactionSchema.statics.myReactionOnComment = async (
  commentId: string,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<string | null> => {
  const result = await CommentReactionModel.findOne({
    commentId,
    ...(authorIdType === "channelId"
      ? { channelId: authorId }
      : { userId: authorId }),
  });

  return result?.reactionType || null;
};

commentReactionSchema.statics.deleteCommentReactionByCommentId = async (
  commentId: string,
  session: ClientSession,
): Promise<unknown> => {
  return await CommentReactionModel.findOneAndDelete(
    {
      commentId,
    },
    session ? { session } : {},
  );
};

commentReactionSchema.statics.toggleCommentReaction = async (
  commentId: string,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<boolean | unknown> => {
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
};

commentReactionSchema.statics.reactOnComment = async (
  commentId: string,
  authorId: string,
  authorIdType: TAuthorType,
  reactionType: TCommentReactionType,
): Promise<unknown> => {
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
};
