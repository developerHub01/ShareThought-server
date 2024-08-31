import QueryBuilder from "../../builder/QueryBuilder";
import { TCommentReactionType } from "./comment.reaction.interface";
import { CommentReactionModel } from "./model/model";

const myReactionOnComment = async (
  commentId: string,
  userId: string,
  channelId: string | undefined,
) => {
  return await CommentReactionModel.myReactionOnComment(
    commentId,
    channelId || userId,
    channelId ? "channelId" : "userId",
  );
};

const allReactionOnComment = async (
  query: Record<string, unknown>,
  commentId: string,
) => {
  const commentReactionQuery = new QueryBuilder(
    CommentReactionModel.find({
      commentId,
    })
      .populate({
        path: "userId",
        select: "fullName avatar",
      })
      .populate({
        path: "channelId",
        select: "channelName channelAvatar",
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
};

const reactOnComment = async (
  commentId: string,
  userId: string,
  channelId: string | undefined,
  reactionType?: TCommentReactionType | undefined,
) => {
  if (reactionType)
    return await CommentReactionModel.reactOnComment(
      commentId,
      channelId || userId,
      channelId ? "channelId" : "userId",
      reactionType,
    );

  return await CommentReactionModel.toggleCommentReaction(
    commentId,
    channelId || userId,
    channelId ? "channelId" : "userId",
  );
};

export const CommentReactionServices = {
  myReactionOnComment,
  allReactionOnComment,
  reactOnComment,
};
