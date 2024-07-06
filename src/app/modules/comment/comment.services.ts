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

const createComment = async (payload: ICreateComment) => {
  try {
    return await CommentModel.create({ ...payload });
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

export const CommentServices = {
  findCommentByPostId,
  findCommentById,
  createComment,
  updateComment,
  deleteComment,
};
