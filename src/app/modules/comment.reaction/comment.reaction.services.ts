import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { TCommentReactionType } from "./comment.reaction.interface";
import { CommentReactionModel } from "./comment.reaction.model";

const myReactionOnComment = async (userId: string, commentId: string) => {
  try {
    return await CommentReactionModel.myReactionOnComment(userId, commentId);
  } catch (error) {
    errorHandler(error);
  }
};

const allReactionOnComment = async (
  query: Record<string, unknown>,
  userId: string,
  commentId: string,
) => {
  try {
    try {
      const commentReactionQuery = new QueryBuilder(
        CommentReactionModel.find({
          userId,
          commentId,
        }).populate({
          path: "userId",
          select: "fullName avatar",
        }),
        query,
      )
        .filter()
        .sort()
        .paginate()
        .fields();

      const meta = await commentReactionQuery.countTotal();
      const result = await commentReactionQuery.modelQuery;

      return {
        meta,
        result,
      };
    } catch (error) {
      errorHandler(error);
    }
  } catch (error) {
    errorHandler(error);
  }
};

const reactOnComment = async (
  userId: string,
  commentId: string,
  reactionType?: TCommentReactionType | undefined,
) => {
  try {
    if (reactionType)
      return await CommentReactionModel.reactOnComment(
        userId,
        commentId,
        reactionType,
      );

    return await CommentReactionModel.toggleCommentReaction(userId, commentId);
  } catch (error) {
    errorHandler(error);
  }
};

export const CommentReactionServices = {
  myReactionOnComment,
  allReactionOnComment,
  reactOnComment,
};
