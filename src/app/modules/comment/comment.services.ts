import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { ICreateComment } from "./comment.interface";
import { CommentModel } from "./comment.model";

const findCommentByPostId = async (
  query: Record<string, unknown>,
  postId: string,
) => {
  try {
    const commentQuery = new QueryBuilder(
      CommentModel.find({ postId }).populate({
        path: "commentAuthorId",
        select: "fullName avatar",
      }),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await commentQuery.countTotal();
    const result = await commentQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};
const findCommentById = async (commentId: string) => {
  try {
    return await CommentModel.findComment(commentId);
  } catch (error) {
    errorHandler(error);
  }
};

const createComment = async (
  payload: ICreateComment,
  postId: string,
  userId: string,
) => {
  try {
    payload = {
      ...payload,
      postId,
      commentAuthorId: userId,
    };
    return await CommentModel.createComment(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const replyComment = async (
  payload: ICreateComment,
  userId: string,
  parentCommentId: string,
) => {
  try {
    payload = {
      ...payload,
      parentCommentId,
      commentAuthorId: userId,
    };
    return await CommentModel.createComment(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const updateComment = async (
  payload: ICreateComment,
  commentId: string,
  userId: string,
) => {
  try {
    return await CommentModel.updateComment(payload, commentId, userId);
  } catch (error) {
    errorHandler(error);
  }
};

const deleteComment = async (commentId: string, userId: string) => {
  try {
    return await CommentModel.deleteComment(commentId, userId);
  } catch (error) {
    errorHandler(error);
  }
};

const deleteAllComment = async (commentId: string, userId: string) => {
  try {
    return await CommentModel.deleteAllCommentByPostId(commentId, userId);
  } catch (error) {
    errorHandler(error);
  }
};

export const CommentServices = {
  findCommentByPostId,
  findCommentById,
  replyComment,
  createComment,
  updateComment,
  deleteComment,
  deleteAllComment,
};
